"use client";

import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ChartCard, SimpleBarChart, SimplePieChart, MultiLineChart, SimpleAreaChart } from "@/components/common/Charts";
import { MONTHLY_DATA, CATEGORY_DISTRIBUTION, RATING_DISTRIBUTION } from "@/lib/sampleData";

export function AdminAnalytics() {
  return (
    <div>
      <PageHeader title="Platform Analytics" description="Deep platform insights" icon={BarChart3} />

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Platform Growth" description="Multi-metric trend">
          <MultiLineChart
            data={MONTHLY_DATA}
            xKey="month"
            lines={[
              { key: "admissions", color: "#2563EB", name: "Admissions" },
              { key: "enrollments", color: "#10B981", name: "Enrollments" },
              { key: "views", color: "#F59E0B", name: "Views" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Platform Activity" description="Monthly admissions">
          <SimpleAreaChart data={MONTHLY_DATA} xKey="month" yKey="admissions" color="#2563EB" />
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Course Categories" description="Distribution">
          <SimplePieChart data={CATEGORY_DISTRIBUTION} />
        </ChartCard>
        <ChartCard title="Review Distribution" description="By rating">
          <SimpleBarChart data={RATING_DISTRIBUTION} xKey="name" yKey="value" color="#F59E0B" />
        </ChartCard>
      </div>
    </div>
  );
}
