'use client'
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div>
            <p>Total Runs (This Month): {monthlyRuns.length}</p>
            <p>Total Discrepancy: ${totalDifference.toFixed(2)}</p>
          </div>
          <Button disabled title="Coming soon">Trigger New Reconciliation</Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th>Period</th>
                <th>Matched</th>
                <th>Unmatched</th>
                <th>Discrepancy</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {runs.map(run => (
                <tr key={run.id}>
                  <td>{run.periodStart} - {run.periodEnd}</td>
                  <td>{run.matchedCount}</td>
                  <td>{run.unmatchedCount}</td>
                  <td>${Number(run.difference).toFixed(2)}</td>
                  <td>
                    <Badge>{run.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  )
}