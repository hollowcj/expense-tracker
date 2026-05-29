import React from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Bell,
  Search,
} from "lucide-react";

export default function InsightPage() {
  return (
    <div className="min-h-screen bg-[#dfe9e5] p-6 md:p-10 font-sans">
      {/* Top Actions */}
      <div className="flex justify-end items-center gap-4 mb-8">
        <div className="bg-white w-full max-w-sm h-16 rounded-3xl px-5 flex items-center gap-3 shadow-sm">
          <Search className="text-[#083b39]" size={22} />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-lg w-full text-[#083b39]"
          />
        </div>

        <button className="bg-[#a8bfbb] w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
          <Bell className="text-white" size={24} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance */}
        <div className="bg-white rounded-[30px] p-8 shadow-sm min-h-[220px] flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <h3 className="text-[#6d7485] text-xl lg:text-2xl font-semibold">
              Total Balance
            </h3>

            <Wallet className="text-[#083b39]" size={30} />
          </div>

          <div>
            <h1 className="text-[42px] lg:text-[52px] xl:text-[58px] leading-tight font-bold text-[#083b39] break-words">
              ₦245,000
            </h1>

            <p className="text-[#15b33d] text-lg lg:text-xl mt-3">
              +12% from last month
            </p>
          </div>
        </div>

        {/* Income */}
        <div className="bg-white rounded-[30px] p-8 shadow-sm min-h-[220px] flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <h3 className="text-[#6d7485] text-xl lg:text-2xl font-semibold">
              Income
            </h3>

            <TrendingUp className="text-[#15b33d]" size={30} />
          </div>

          <div>
            <h1 className="text-[42px] lg:text-[52px] xl:text-[58px] leading-tight font-bold text-[#083b39] break-words">
              ₦80,000
            </h1>

            <p className="text-[#15b33d] text-lg lg:text-xl mt-3">
              +8% this week
            </p>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-[30px] p-8 shadow-sm min-h-[220px] flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <h3 className="text-[#6d7485] text-xl lg:text-2xl font-semibold">
              Expenses
            </h3>

            <TrendingDown className="text-red-500" size={30} />
          </div>

          <div>
            <h1 className="text-[42px] lg:text-[52px] xl:text-[58px] leading-tight font-bold text-[#083b39] break-words">
              ₦35,000
            </h1>

            <p className="text-red-500 text-lg lg:text-xl mt-3">
              +3% this week
            </p>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white rounded-[35px] p-8 md:p-10 shadow-sm mt-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#083b39]">
              Spending Insights
            </h2>

            <p className="text-[#6d7485] text-xl mt-3">
              Monitor your weekly spending activity.
            </p>
          </div>

          <button className="bg-[#a8bfbb] text-white text-xl font-semibold px-8 py-4 rounded-2xl w-fit">
            Export Report
          </button>
        </div>

        {/* Chart */}
        <div className="mt-14">
          <div className="flex items-end gap-5 h-[350px]">
            <div className="bg-[#c6d4d0] rounded-t-[30px] flex-1 h-[120px]"></div>

            <div className="bg-[#083b39] rounded-t-[30px] flex-1 h-[220px]"></div>

            <div className="bg-[#c6d4d0] rounded-t-[30px] flex-1 h-[170px]"></div>

            <div className="bg-[#083b39] rounded-t-[30px] flex-1 h-[310px]"></div>

            <div className="bg-[#c6d4d0] rounded-t-[30px] flex-1 h-[240px]"></div>

            <div className="bg-[#083b39] rounded-t-[30px] flex-1 h-[280px]"></div>
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-5 text-[#6d7485] text-xl font-medium px-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-[35px] p-8 md:p-10 shadow-sm mt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#083b39]">
            Recent Transactions
          </h2>

          <CreditCard className="text-[#083b39]" size={30} />
        </div>

        <div className="space-y-5">
          <div className="bg-[#f3f6f5] rounded-3xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-[#083b39] text-2xl font-semibold">
                Netflix Subscription
              </h3>

              <p className="text-[#6d7485] text-lg mt-1">
                Today
              </p>
            </div>

            <p className="text-red-500 text-2xl font-bold">
              - ₦7,500
            </p>
          </div>

          <div className="bg-[#f3f6f5] rounded-3xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-[#083b39] text-2xl font-semibold">
                Salary Payment
              </h3>

              <p className="text-[#6d7485] text-lg mt-1">
                Yesterday
              </p>
            </div>

            <p className="text-[#15b33d] text-2xl font-bold">
              + ₦120,000
            </p>
          </div>

          <div className="bg-[#f3f6f5] rounded-3xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-[#083b39] text-2xl font-semibold">
                Grocery Shopping
              </h3>

              <p className="text-[#6d7485] text-lg mt-1">
                2 days ago
              </p>
            </div>

            <p className="text-red-500 text-2xl font-bold">
              - ₦18,000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}