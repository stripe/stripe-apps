import { Box, Inline } from "@stripe/ui-extension-sdk/ui";
import { BarChart, LineChart } from "@stripe/ui-extension-sdk/ui/next";

type ChartDataPoint = {
  x: Date | string;
  y: number;
  name: string;
};

type ChartsModuleProps = {
  memberGrowthChartData: ChartDataPoint[];
  revenueChartData: ChartDataPoint[];
};

export function ChartsModule({
  memberGrowthChartData,
  revenueChartData,
}: ChartsModuleProps) {
  return (
    <Box
      css={{
        stack: "y",
        gap: "small",
        padding: "small",
        borderRadius: "medium",
        backgroundColor: "container",
      }}
    >
      <Box
        css={{
          stack: "y",
          gap: "xsmall",
          padding: "medium",
          borderRadius: "medium",
          backgroundColor: "surface",
        }}
      >
        <Inline css={{ font: "subtitle", fontWeight: "bold" }}>
          Member growth
        </Inline>
        <Box css={{ height: 182 }}>
          <LineChart data={memberGrowthChartData} />
        </Box>
      </Box>

      <Box
        css={{
          stack: "y",
          gap: "xsmall",
          padding: "medium",
          borderRadius: "medium",
          backgroundColor: "surface",
        }}
      >
        <Inline css={{ font: "subtitle", fontWeight: "bold" }}>
          Revenue from members
        </Inline>
        <Box css={{ height: 182 }}>
          <BarChart data={revenueChartData} />
        </Box>
      </Box>
    </Box>
  );
}
