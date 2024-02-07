
const targetAttributes = [{
    label: 'Customer ID',
    targetAttributeName: 'id'
}, {
    label: 'Name',
    targetAttributeName: 'name'
}, {
    label: 'Email',
    targetAttributeName: 'email'
}];

function placeErrorMessageElement( id, message ) {
    const rowElement = document.getElementById( id );
    const errorResponseElement = document.createElement( 'p' );
    errorResponseElement.textContent = message;
    errorResponseElement.setAttribute( 'id', id );
    rowElement.replaceWith( errorResponseElement );
}

async function loadStripeCustomer() {
    const rowElementId = 'stripe-sample-customer-table';
    const rowElement = document.getElementById( rowElementId );
    const { root, nonce } = stripeSampleWPApiSettings;
    const response = await fetch( root + 'stripe-apps/v1/customers', {
        method: 'GET',
        headers: {
            'X-WP-Nonce': nonce,
        }
    } );
    const customers = await response.json();
    if ( response.status > 399 ) {
        placeErrorMessageElement( rowElementId, `${customers.code}: ${customers.message}` );
        return;
    }
    if ( ! customers || customers.length < 1 ) {
        placeErrorMessageElement( rowElementId, 'No customer registered. Please add customer on Stripe Dashboard.' );
        return;
    }
    const tableElement = document.createElement( 'table' );
    tableElement.setAttribute( 'class', 'wp-list-table widefat fixed striped table-view-list' );
    
    const tableHeadElement = document.createElement( 'thead' );
    const tableHeadRowElement = document.createElement( 'tr' );
    const tableHadIDElement = document.createElement( 'th' );
    tableHadIDElement.textContent = 'No.';
    tableHeadRowElement.appendChild( tableHadIDElement );
    targetAttributes.forEach(target => {
        const headElement = document.createElement( 'th' );
        headElement.textContent = target.label;
        tableHeadRowElement.appendChild( headElement );
    })
    tableHeadElement.appendChild( tableHeadRowElement );

    const tableBodyElement = document.createElement( 'tbody' );
    customers.forEach( ( customer, i ) => {
        const customerLineElement = document.createElement( 'tr' );
        const lineIdElement = document.createElement( 'td' );
        lineIdElement.textContent = i;
        customerLineElement.appendChild( lineIdElement );

        targetAttributes.forEach(target => {
            const attributeElement = document.createElement( 'td' );
            attributeElement.textContent = customer[ target.targetAttributeName ];
            customerLineElement.appendChild( attributeElement );
        });
        tableBodyElement.appendChild( customerLineElement );
    });
    tableElement.appendChild( tableHeadElement );
    tableElement.appendChild( tableBodyElement );
    if (rowElement.children.length > 0) {
        rowElement.replaceChild( tableElement, rowElement.children[0] );
    } else {
        rowElement.appendChild( tableElement );
    }
}

async function createStripeCustomer() {
    const rowElementId = 'stripe-sample-customer-table';
    const { root, nonce } = stripeSampleWPApiSettings;
    const response = await fetch( root + 'stripe-apps/v1/customers', {
        method: 'PUT',
        headers: {
            'X-WP-Nonce': nonce,
        }
    } );
    const customers = await response.json();
    if ( response.status > 399 ) {
        placeErrorMessageElement( rowElementId, `${customers.code}: ${customers.message}` );
        return;
    }

    await loadStripeCustomer();
}

document.addEventListener( 'DOMContentLoaded', () => {
    const fetchCustomerButton = document.getElementById( 'fetch-customer-button' );
    fetchCustomerButton.addEventListener( 'click', loadStripeCustomer );
    const createCustomerButton = document.getElementById( 'create-new-customer' );
    createCustomerButton.addEventListener( 'click', createStripeCustomer );
})
