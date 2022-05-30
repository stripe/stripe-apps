using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Model;
using Stripe;
using dotenv.net;
using dotenv.net.Utilities;


namespace dotnet.Controllers;

[ApiController]
[Route("")]
public class StripeWebHook : ControllerBase
{
    public StripeWebHook() 
    {
        DotEnv.Load();
    }
    // This represents a database or other external infrastructure for
    // the purposes of this example. In a production system you would need
    // to set up a true persistent store.

    private static readonly List<UserAccount> AccountStore = new()
    {

    };

    [HttpPost("webhook")]
    public async Task<IActionResult> Index()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

        StripeConfiguration.ApiKey = EnvReader.GetStringValue("STRIPE_API_KEY");
        Event stripeEvent;

        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                EnvReader.GetStringValue("STRIPE_WEBHOOK_SECRET")
            );
        }
        catch (StripeException)
        {
            return BadRequest();
        }

        // The "authorized" event will get sent when an account installs the App
        switch (stripeEvent.Type)
        {
            case "account.application.authorized":
            // We also trigger on customer events for testing purposes because
            // application.authorized events cannot be triggered via the CLI yet
	        case "customer.created":
                var service = new AccountService();
                var userAccount = service.Get(stripeEvent.Account);

                var accountData = new UserAccount()
                {
                    Id = userAccount.Id,
                    Name = userAccount.Settings.Dashboard.DisplayName,
                    Date = DateTime.Now
                };

                AccountStore.Add(accountData);
                break;

            // The "deauthorized" event will get sent when an account uninstalls the App
            case "account.application.deauthorized":
            case "customer.deleted":
                var accountIndex = AccountStore.FindIndex(account => account.Id == stripeEvent.Account);
                AccountStore.RemoveAt(accountIndex);
                break;
        }

        return Ok();
    }

    [HttpGet("/accounts")]
    public ActionResult<List<UserAccount>> Get()
    {
        return AccountStore;
    }
}
