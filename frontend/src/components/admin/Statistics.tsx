'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Statistics as StatisticsType } from '../../types'

interface StatisticsProps {
  stats: StatisticsType
}

export function Statistics({ stats }: StatisticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>CVs by Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.cvsByTemplate.map((item) => (
                <div key={item.templateId} className="flex justify-between items-center">
                  <span>{item.templateName}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">New Users</h4>
                <div className="space-y-1">
                  {stats.usersByMonth.slice(-6).map((item) => (
                    <div key={item.month} className="flex justify-between items-center text-sm">
                      <span>{item.month}</span>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">New CVs</h4>
                <div className="space-y-1">
                  {stats.cvsByMonth.slice(-6).map((item) => (
                    <div key={item.month} className="flex justify-between items-center text-sm">
                      <span>{item.month}</span>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}