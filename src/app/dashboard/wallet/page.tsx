import React from "react";
import {
  Bell,
  Search,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  CreditCard,
} from "lucide-react";

export default function WalletPage() {
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

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Wallet Card */}
        <div className="lg:col-span-2 bg-[#083b39] rounded-[35px] p-8 md:p-10 text-white shadow-sm overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#dfe9e5] text-xl">
                Main Wallet
              </p>

              <h1 className="text-5xl md:text-6xl font-bold mt-4 leading-tight">
                ₦245,000
              </h1>
            </div>

            <Wallet size={36} />
          </div>

          <div className="mt-16">
            <p className="text-[#c6d4d0] text-lg tracking-[4px]">
              **** **** **** 2034
            </p>

            <div className="flex justify-between items-center mt-8">
              <div>
                <p className="text-[#c6d4d0] text-sm">
                  Card Holder
                </p>

                <h3 className="text-2xl font-semibold mt-1">
                  Tochukwu
                </h3>
              </div>

              <div>
                <p className="text-[#c6d4d0] text-sm">
                  Expires
                </p>

                <h3 className="text-2xl font-semibold mt-1">
                  08/29
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-[35px] p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-[#083b39]">
            Quick Actions
          </h2>

          <div className="space-y-5 mt-8">
            <button className="w-full bg-[#083b39] text-white rounded-3xl p-5 flex items-center justify-between hover:scale-[1.02] transition">
              <span className="text-xl font-semibold">
                Add Money
              </span>

              <Plus size={26} />
            </button>

            <button className="w-full bg-[#f3f6f5] text-[#083b39] rounded-3xl p-5 flex items-center justify-between hover:scale-[1.02] transition">
              <span className="text-xl font-semibold">
                Send Money
              </span>

              <ArrowUpRight size={26} />
            </button>

            <button className="w-full bg-[#f3f6f5] text-[#083b39] rounded-3xl p-5 flex items-center justify-between hover:scale-[1.02] transition">
              <span className="text-xl font-semibold">
                Withdraw
              </span>

              <ArrowDownLeft size={26} />
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Income */}
        <div className="bg-white rounded-[30px] p-8 shadow-sm min-h-[220px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-[#6d7485] text-xl lg:text-2xl font-semibold">
              Monthly Income
            </h3>

            <ArrowUpRight
              className="text-[#15b33d]"
              size={30}
            />
          </div>

          <div>
            <h1 className="text-[42px] lg:text-[52px] leading-tight font-bold text-[#083b39]">
              ₦120,000
            </h1>

            <p className="text-[#15b33d] text-lg mt-3">
              +15% increase
            </p>
          </div>
        </div>

        {/* Spending */}
        <div className="bg-white rounded-[30px] p-8 shadow-sm min-h-[220px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-[#6d7485] text-xl lg:text-2xl font-semibold">
              Spending
            </h3>

            <ArrowDownLeft
              className="text-red-500"
              size={30}
            />
          </div>

          <div>
            <h1 className="text-[42px] lg:text-[52px] leading-tight font-bold text-[#083b39]">
              ₦48,000
            </h1>

            <p className="text-red-500 text-lg mt-3">
              +5% this month
            </p>
          </div>
        </div>

        {/* Savings */}
        <div className="bg-white rounded-[30px] p-8 shadow-sm min-h-[220px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-[#6d7485] text-xl lg:text-2xl font-semibold">
              Savings
            </h3>

            <Wallet className="text-[#083b39]" size={30} />
          </div>

          <div>
            <h1 className="text-[42px] lg:text-[52px] leading-tight font-bold text-[#083b39]">
              ₦76,000
            </h1>

            <p className="text-[#15b33d] text-lg mt-3">
              Goal progress 72%
            </p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-[35px] p-8 md:p-10 shadow-sm mt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#083b39]">
            Wallet Transactions
          </h2>

          <CreditCard className="text-[#083b39]" size={30} />
        </div>

        <div className="space-y-5">
          <div className="bg-[#f3f6f5] rounded-3xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-[#083b39] text-2xl font-semibold">
                Bank Deposit
              </h3>

              <p className="text-[#6d7485] text-lg mt-1">
                Today
              </p>
            </div>

            <p className="text-[#15b33d] text-2xl font-bold">
              + ₦50,000
            </p>
          </div>

          <div className="bg-[#f3f6f5] rounded-3xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-[#083b39] text-2xl font-semibold">
                Airtime Purchase
              </h3>

              <p className="text-[#6d7485] text-lg mt-1">
                Yesterday
              </p>
            </div>

            <p className="text-red-500 text-2xl font-bold">
              - ₦5,000
            </p>
          </div>

          <div className="bg-[#f3f6f5] rounded-3xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-[#083b39] text-2xl font-semibold">
                Transfer to John
              </h3>

              <p className="text-[#6d7485] text-lg mt-1">
                2 days ago
              </p>
            </div>

            <p className="text-red-500 text-2xl font-bold">
              - ₦12,500
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}