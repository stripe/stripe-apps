import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Img,
  Inline,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Select,
} from "@stripe/ui-extension-sdk/ui";
import { BaseView } from "../components/BaseView";

import FiddleLeafFig from "../assets/fiddle-leaf-fig.jpeg";
import FicusAltissima from "../assets/ficus-altissima.jpeg";
import GardeningToolSet from "../assets/gardening-tool-set.jpeg";

const defaultProducts = [
  {
    id: 1,
    name: "Fiddle Leaf Fig",
    image: FiddleLeafFig,
    selected: false,
    quantity: 1,
  },
  {
    id: 2,
    name: "Ficus Altissima",
    image: FicusAltissima,
    selected: false,
    quantity: 2,
  },
  {
    id: 3,
    name: "Gardening Tool Set",
    image: GardeningToolSet,
    selected: false,
    quantity: 1,
  },
];
const dropdownQuantity = Array.from({ length: 10 }, (_, n) => n + 1);

const ConsoleView = () => {
  const navigate = useNavigate();
  return (
    <BaseView
      title="Label printer"
      footer={<Box>Hi</Box>}
      actions={
        <Button
          type="primary"
          css={{
            width: "fill",
            alignX: "center",
          }}
          onPress={() => navigate("/shipment")}
        >
          Add product
        </Button>
      }
    >
      {/* View content */}
      <Box
        css={{
          stack: "y",
          gap: "small",
        }}
      >
        <Inline css={{ font: "heading" }}>Create a fullfillment</Inline>
        Select products to add to a fullfillment
      </Box>
      {/* Product table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell width="maximized">
              <Checkbox />
              Product
            </TableHeaderCell>
            <TableHeaderCell>QTY</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {defaultProducts.map((product) => {
            return (
              <TableRow key={product.id}>
                <TableCell>
                  <Box
                    css={{
                      stack: "x",
                      gap: "small",
                      alignY: "center",
                      alignX: "start",
                    }}
                  >
                    <Checkbox />
                    <Img
                      src={product.image}
                      height="40"
                      width="40"
                      alt={product.name}
                      css={{
                        borderRadius: "medium",
                      }}
                    />
                    {product.name}
                  </Box>
                </TableCell>
                <TableCell vAlign="middle">
                  <Select
                    name="quantity"
                    aria-label="product quantity dropdown"
                    css={{
                      width: "max",
                    }}
                  >
                    <option value={0}>-</option>
                    {dropdownQuantity.map((x, index) => {
                      return (
                        <option
                          key={index}
                          value={x}
                          selected={x === product.quantity ? true : false}
                        >
                          {String(x)}
                        </option>
                      );
                    })}
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Box
        css={{
          marginTop: "medium",
        }}
      >
        <Button
          onPress={() => navigate(-1)}
          css={{
            alignX: "center",
            width: "fill",
          }}
        >
          Cancel
        </Button>
      </Box>
    </BaseView>
  );
};

export default ConsoleView;
