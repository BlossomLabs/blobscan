import { useMemo } from "react";
import type { NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import { Logo } from "~/components/BlobscanLogo";
import { Button } from "~/components/Button";
import { Card } from "~/components/Cards/Card";
import { ChartCard } from "~/components/Cards/ChartCard";
import { MetricCard } from "~/components/Cards/MetricCard";
import { BlobTransactionCard } from "~/components/Cards/SurfaceCards/BlobTransactionCard";
import { BlockCard } from "~/components/Cards/SurfaceCards/BlockCard";
import { DailyTransactionsChart } from "~/components/Charts/Transaction";
import { Link } from "~/components/Link";
import { SearchInput } from "~/components/SearchInput";
import { bytesToKilobytes, formatDailyTransactionStats } from "~/utils";

const TOTAL_BLOCKS = 4;
const TOTAL_TXS = 5;

const Home: NextPage = () => {
  const router = useRouter();
  const {
    data: latestBlocks,
    error: latestBlocksError,
    isLoading: latestBlocksLoading,
  } = api.block.getAll.useQuery({
    p: 1,
    ps: TOTAL_BLOCKS,
  });
  const {
    data: latestTxs,
    error: latestTxsError,
    isLoading: latestTxsLoading,
  } = api.tx.getAll.useQuery({
    p: 1,
    ps: TOTAL_TXS,
  });
  const { data: allOverallStats, error: allOverallStatsError } =
    api.stats.getAllOverallStats.useQuery();
  const { data: dailyTxStatsData, error: dailyTxStatsError } =
    api.stats.transaction.getDailyStats.useQuery({
      timeFrame: "15d",
    });
  const dailyTxStats = useMemo(
    () => formatDailyTransactionStats(dailyTxStatsData ?? []),
    [dailyTxStatsData],
  );

  const error =
    latestBlocksError ||
    latestTxsError ||
    allOverallStatsError ||
    dailyTxStatsError;

  if (error) {
    return (
      <NextError
        title={error.message}
        statusCode={error.data?.httpStatus ?? 500}
      />
    );
  }

  const blocks = latestBlocks?.blocks ?? [];
  const txs = latestTxs?.transactions ?? [];

  return (
    <div className="flex flex-col items-center justify-center gap-12 sm:gap-20">
      <div className=" flex flex-col items-center justify-center gap-8 md:w-8/12">
        <Logo className="h-16 w-64 md:h-20 md:w-80 lg:h-20 lg:w-80" />
        <div className="flex w-full max-w-lg flex-col items-stretch justify-center space-y-2">
          <SearchInput />
          <span className="text- text-center text-sm  text-contentSecondary-light dark:text-contentSecondary-dark">
            Blob transaction explorer for the{" "}
            <Link href="https://www.eip4844.com/" isExternal>
              EIP-4844
            </Link>
          </span>
        </div>
      </div>
      <div className="flex w-11/12 flex-col gap-8 sm:gap-16">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-10">
          <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-4 sm:grid-cols-2">
            <MetricCard
              name="Total Blocks"
              value={allOverallStats?.block?.totalBlocks}
              compact
            />
            <MetricCard
              name="Total Transactions"
              value={allOverallStats?.transaction?.totalTransactions}
              compact
            />
            <MetricCard
              name="Total Blobs"
              value={allOverallStats?.blob?.totalBlobs}
              compact
            />
            <MetricCard
              name="Total Blob Size"
              value={
                allOverallStats?.blob?.totalBlobSize
                  ? bytesToKilobytes(allOverallStats.blob.totalBlobSize)
                  : 0
              }
              unit="KB"
              compact
            />
            <MetricCard
              name="Avg. Blob Size"
              value={
                allOverallStats?.blob?.avgBlobSize
                  ? Number(
                      bytesToKilobytes(
                        allOverallStats?.blob?.avgBlobSize,
                      ).toFixed(2),
                    )
                  : 0
              }
              unit="KB"
              compact
            />
            <MetricCard
              name="Total Unique Blobs"
              value={allOverallStats?.blob?.totalUniqueBlobs ?? 0}
              compact
            />
          </div>

          <div className="col-span-2 sm:col-span-6">
            {dailyTxStats && (
              <ChartCard title="Daily Transactions">
                <div className="h-48 md:h-60 lg:h-48">
                  <DailyTransactionsChart
                    days={dailyTxStats.days}
                    transactions={dailyTxStats.transactions}
                    compact
                  />
                </div>
              </ChartCard>
            )}
          </div>
        </div>
        <Card
          header={
            <div className="flex items-center justify-between">
              <div>Latest Blocks</div>{" "}
              <Button
                variant="outline"
                label="View All Blocks"
                onClick={() => void router.push("/blocks")}
              />
            </div>
          }
        >
          <div className="flex flex-col flex-wrap gap-5 lg:flex-row">
            {latestBlocksLoading
              ? Array(TOTAL_BLOCKS)
                  .fill(0)
                  .map((_, i) => (
                    <div className="flex-grow" key={i}>
                      <BlockCard />
                    </div>
                  ))
              : blocks.map((b) => (
                  <div className="flex-grow" key={b.hash}>
                    <BlockCard block={b} />
                  </div>
                ))}
          </div>
        </Card>
        <Card
          header={
            <div className="flex items-center justify-between">
              <div>Latest Blob Transactions</div>{" "}
              <Button
                variant="outline"
                label="View All Txs"
                onClick={() => void router.push("/txs")}
              />
            </div>
          }
        >
          <div className=" flex flex-col gap-5">
            {latestTxsLoading
              ? Array(TOTAL_TXS)
                  .fill(0)
                  .map((_, i) => <BlobTransactionCard key={i} />)
              : txs?.map((tx) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { block, blockNumber, ...filteredTx } = tx;

                  return (
                    <BlobTransactionCard
                      key={tx.hash}
                      transaction={filteredTx}
                      block={{ ...tx.block, number: blockNumber }}
                    />
                  );
                })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
