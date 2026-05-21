import React, { useState } from 'react';
import { Home, User, MessageSquare, Users, UserCircle, Briefcase, ArrowLeftRight, Users2, FileText, ShoppingBag, CreditCard, Search, Bell, Settings, Send, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRobux, formatFull } from '@/lib/format';
import SendRobuxModal from './SendRobuxModal';
import SettingsModal, { type CurrentUser } from './SettingsModal';
import { RobloxAvatar } from './RobloxAvatar';
import rivalsBanner from "@/assets/magicpath/rivals-banner.png";
const RobuxIcon = ({
  className,
  size = 16
}: {
  className?: string;
  size?: number;
}) => <svg viewBox="0 0 32 32" width={size} height={size} className={cn("fill-current", className)}>
    <path d="M15.0762 7.29574C15.6479 6.96571 16.3521 6.96571 16.9238 7.29574L23.0762 10.8479C23.6479 11.1779 24 11.7878 24 12.4479V19.5521C24 20.2122 23.6479 20.8221 23.0762 21.1521L16.9238 24.7043C16.3521 25.0343 15.6479 25.0343 15.0762 24.7043L8.92376 21.1521C8.35214 20.8221 8 20.2122 8 19.5521V12.4479C8 11.7878 8.35214 11.1779 8.92376 10.8479L15.0762 7.29574ZM11.9998 13V19C11.9998 19.5523 12.4475 20 12.9998 20H18.9998C19.5521 20 19.9998 19.5523 19.9998 19V13C19.9998 12.4477 19.5521 12 18.9998 12H12.9998C12.4475 12 11.9998 12.4477 11.9998 13Z" />
    <path d="M13.8556 2.56068C15.1825 1.81311 16.8175 1.81311 18.1444 2.56068L26.8556 7.46819C28.1825 8.21577 29 9.59734 29 11.0925V20.9075C29 22.4027 28.1825 23.7842 26.8556 24.5318L18.1444 29.4393C16.8175 30.1869 15.1825 30.1869 13.8556 29.4393L5.14444 24.5318C3.81746 23.7842 3 22.4027 3 20.9075V11.0925C3 9.59734 3.81746 8.21577 5.14444 7.46819L13.8556 2.56068ZM17.1628 4.30319C16.4452 3.89894 15.5548 3.89894 14.8372 4.30319L6.12611 9.2107C5.41362 9.61209 5 10.336 5 11.0925V20.9075C5 21.664 5.41362 22.3879 6.12611 22.7893L14.8372 27.6968C15.5548 28.1011 16.4452 28.1011 17.1628 27.6968L25.8739 22.7893C26.5864 22.3879 27 21.664 27 20.9075V11.0925C27 10.336 26.5864 9.61209 25.8739 9.2107L17.1628 4.30319Z" />
  </svg>;
const RobloxPlusIcon = ({
  className,
  size = 16,
  strokeWidth
}: {
  className?: string;
  size?: number;
  strokeWidth?: number | string;
}) => <svg viewBox="0 0 32 32" width={size} height={size} className={cn("fill-current", className)}>
    <path d="M13.855 3.56a4.382 4.382 0 014.29 0l8.71 4.908A4.17 4.17 0 0129 12.093v9.814a4.169 4.169 0 01-2.145 3.625l-8.71 4.907-.252.131a4.385 4.385 0 01-3.786 0l-.252-.13-2.837-1.6A2.001 2.001 0 0110 27.099V13a2 2 0 012-2h8a2 2 0 012 2v7a2 2 0 01-2 2h-4a1 1 0 010-2h4v-7h-8v14.098l2.837 1.598a2.382 2.382 0 002.326 0l8.711-4.908A2.168 2.168 0 0027 21.907v-9.814c0-.756-.414-1.48-1.126-1.882l-8.71-4.908a2.383 2.383 0 00-2.327 0L6.126 10.21A2.169 2.169 0 005 12.093v9.814c0 .757.414 1.48 1.126 1.882l.364.205a1.001 1.001 0 01-.981 1.743l-.364-.205A4.169 4.169 0 013 21.907v-9.814a4.16 4.16 0 011.901-3.478l.244-.147 8.71-4.907z" />
  </svg>;
export const RobuxPurchasePage = () => {
  const [balance, setBalance] = useState<number>(195_117_403);
  const [sendOpen, setSendOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: 'HANNICHO',
    handle: '@HANNICHO',
    avatarUrl: null,
  });
  return <div className="min-h-screen flex flex-col bg-[#0f0f13] text-white font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="h-12 bg-[#1b1b1e] border-b border-white/5 flex items-center px-6 shrink-0 fixed top-0 w-full z-50 justify-between gap-4">
        <div className="flex items-center gap-8 h-full shrink-0">
          <div className="flex items-center h-full shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="118" height="30" fill="none" viewBox="0 0 320 60" className="shrink-0"><path fill="#fff" d="m38.58 38.404 9.21 16.859H30.7l-7.777-14.407h-7.368v14.407H0V4.193h28.449c11.768 0 19.24 6.532 19.24 18.278 0 7.558-3.48 12.972-9.11 15.933M15.555 17.466v10.112h11.052c3.274 0 5.32-1.941 5.32-5.107s-2.046-5.005-5.32-5.005zm81.663 41.571L50.656 46.474 63.141 0l23.28 6.282 23.281 6.281zM88.417 24.82 75.42 21.245l-3.48 12.972 12.997 3.575zm74.602 16.036c0 9.805-6.242 14.407-15.964 14.407H116.56V4.193h29.472c9.721 0 15.963 5.005 15.963 13.789 0 5.515-2.046 9.193-5.935 11.747 4.401 1.934 6.959 5.816 6.959 11.127M131.705 16.45v7.558h10.125c2.763 0 4.401-1.226 4.401-3.881 0-2.452-1.638-3.677-4.401-3.677zm0 26.556h11.359c2.661 0 4.201-1.43 4.201-3.883 0-2.654-1.535-3.88-4.201-3.88h-11.359zm38.989-38.813h15.552v35.949h22.309v15.12h-37.863zm95.068 25.536c0 5.252-1.56 10.387-4.484 14.754a26.6 26.6 0 0 1-11.94 9.78 26.66 26.66 0 0 1-15.373 1.512 26.62 26.62 0 0 1-13.623-7.268 26.521 26.521 0 0 1-5.768-28.94c2.014-4.853 5.424-9 9.8-11.919a26.64 26.64 0 0 1 14.782-4.475 26.565 26.565 0 0 1 18.827 7.76 26.5 26.5 0 0 1 5.767 8.621 26.4 26.4 0 0 1 2.012 10.17zm-15.554 0c0-6.334-5.015-11.339-11.052-11.339-6.038 0-11.053 5.005-11.053 11.339s5.015 11.337 11.053 11.337c6.037 0 11.052-5.01 11.052-11.343zm53.008-.818L320 55.263h-18.528l-9.205-15.02-9.517 15.02h-18.83l17.499-25.74-16.066-25.33h18.522l8.494 13.789 8.187-13.789h18.42z" /></svg>
          </div>

          <div className="hidden md:flex h-full items-center gap-10 shrink-0">
            {['Charts', 'Marketplace', 'Create', 'Robux'].map((item, i) => <a key={item} href="#" className={cn("text-sm font-semibold h-full flex items-center hover:opacity-80 transition-opacity", item === 'Marketplace' ? "text-blue-400" : "text-white")}>
                  {item}
                </a>)}
          </div>
        </div>

        <div className="flex-1 flex justify-center px-4 max-w-2xl">
          <div className="relative w-full max-w-[476.2px]">
            <Search className="absolute left-[8px] top-1/2 -translate-y-1/2 text-white/50 w-4 h-4" />
            <input type="text" placeholder="Search" className="w-full h-[28px] bg-[rgba(208,217,251,0.08)] border border-[rgba(208,217,251,0.12)] rounded-lg py-[5px] pr-[30px] pl-[33px] text-[16px] leading-[22.4px] focus:outline-none focus:border-white/20 text-[rgb(247,247,248)] placeholder:text-white/50" />
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 px-2 py-1 hover:bg-white/5 rounded-md cursor-pointer">
            <RobloxAvatar src={currentUser.avatarUrl} alt={currentUser.name} size={24} />
            <span className="text-xs font-bold truncate max-w-[120px]">{currentUser.name}</span>
          </div>
          <div className="relative cursor-pointer hover:bg-white/5 p-1.5 rounded-md">
            <Bell className="w-5 h-5" />
            <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-[#1b1b1e]">
              9
            </div>
          </div>
          <button type="button" title={formatFull(balance)} className="flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors h-[36px] rounded-lg p-1 px-3 cursor-pointer font-medium text-[16px] leading-[16px] text-[#f7f7f8]">
            <span className="flex items-center gap-1.5 relative">
              <RobuxIcon size={20} className="text-white" />
              <span className="text-[#f7f7f8] font-semibold text-[15px]">{formatRobux(balance)}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="cursor-pointer hover:bg-white/5 p-1.5 rounded-md"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 pt-12 h-screen">
        {/* Left Sidebar */}
        <aside className="w-[250px] bg-[#111113] h-full flex flex-col shrink-0 overflow-y-auto border-r border-white/5 pb-4 hidden md:flex fixed left-0 top-12 bottom-0 z-40">
          <div className="flex-1 py-4">
            {[{
            type: 'profile',
            label: 'HANNICHO'
          }, {
            icon: Home,
            label: 'Home'
          }, {
            icon: User,
            label: 'Profile'
          }, {
            icon: RobloxPlusIcon,
            label: 'Roblox Plus'
          }, {
            icon: MessageSquare,
            label: 'Messages',
            badge: '44'
          }, {
            icon: Users,
            label: 'Friends',
            badge: '66'
          }, {
            icon: UserCircle,
            label: 'Avatar'
          }, {
            icon: Briefcase,
            label: 'Inventory'
          }, {
            icon: ArrowLeftRight,
            label: 'Trade'
          }, {
            icon: Users2,
            label: 'Communities'
          }, {
            icon: FileText,
            label: 'Blog'
          }, {
            icon: ShoppingBag,
            label: 'Official Store'
          }, {
            icon: CreditCard,
            label: 'Buy Gift Cards'
          }].map(item => <a key={item.label} href="#" className="flex items-center justify-between px-5 py-2.5 hover:bg-white/5 group">
                <div className="flex items-center gap-4 text-white/90 group-hover:text-white">
                  {item.type === 'profile' ? <div className="w-[22px] h-[22px] rounded-full bg-blue-500 overflow-hidden shrink-0 border border-white/10" /> : item.icon && <item.icon className="w-[22px] h-[22px] shrink-0" strokeWidth={2} />}
                  <span className="text-[15px] font-bold">{item.label}</span>
                </div>
                {item.badge && <span className="bg-white text-black text-[11px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>}
              </a>)}
          </div>
          <div className="mx-4 mt-auto p-4 bg-[#1b1b1e] rounded-xl border border-white/5">
            <RobloxPlusIcon className="w-6 h-6 text-white mb-2.5" />
            <p className="text-[13px] text-white/90 leading-[1.4] mb-3">More fun for less Robux. Subscribe to Roblox Plus.</p>
            <a href="#" className="text-[13px] font-bold text-white underline decoration-white/50 hover:decoration-white underline-offset-4">Subscribe</a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#0f0f13] ml-0 md:ml-[250px] overflow-y-auto p-8 relative h-full">
          <div className="max-w-3xl mx-auto w-full pb-20">
            {/* Top Right Action */}
            <div className="absolute top-6 right-8 flex items-center gap-3 bg-[#191a1f] rounded-full py-2 pl-5 pr-2 max-w-[calc(100%-2rem)]">
              <div className="flex items-center justify-center gap-1 min-w-0">
                <RobuxIcon size={22} className="text-[#f7f7f8] shrink-0" />
                <span
                  title={formatFull(balance)}
                  className="text-[#f7f7f8] text-[22px] font-bold leading-none truncate"
                >
                  {formatRobux(balance)}
                </span>
              </div>
              <button
                onClick={() => setSendOpen(true)}
                className="shrink-0 flex items-center gap-1.5 bg-[rgba(208,217,251,0.12)] hover:bg-[rgba(208,217,251,0.22)] text-[#f7f7f8] font-semibold text-[12px] leading-none h-[34px] rounded-full px-3 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Send</span>
              </button>
            </div>

            {/* Header */}
            <div className="text-center mt-12 mb-16">
              <h1 className="text-4xl md:text-[3.25rem] leading-[1.1] font-black tracking-tight max-w-lg mx-auto">
                Enjoy up to 25%<br />more Robux
              </h1>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Bonus item we picked for you</h2>

              <div className="bg-[#18181b] rounded-2xl overflow-hidden border border-white/5">
                {/* Banner Card */}
                <div className="relative h-[112px] w-full overflow-hidden border-b border-white/5 bg-[rgb(18,18,21)] flex items-center">
                  <div className="absolute inset-0 ml-auto w-full sm:w-[750px] right-0">
                    <img src={rivalsBanner} alt="RIVALS RPG Bundle" className="w-full h-full object-cover object-right" />
                  </div>
                  <div className="absolute inset-0 w-full sm:w-[750px] bg-gradient-to-r from-[rgb(18,18,21)] via-[rgb(18,18,21)]/60 to-[rgba(18,18,21,0)] z-10 pointer-events-none"></div>
                  
                  <div className="relative z-20 flex items-center gap-4 px-6 w-full">
                    <div className="w-[72px] h-[72px] rounded-full overflow-hidden shrink-0 shadow-xl relative bg-black/20">
                      <img src={rivalsBanner} alt="RIVALS icon" className="w-full h-full object-cover object-left" />
                      <div className="absolute inset-0 rounded-full border border-white/10 ring-1 ring-inset ring-white/10"></div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-bold text-[19px] leading-none tracking-wide">RIVALS</span>
                        <Info className="w-[15px] h-[15px] text-white/50" strokeWidth={2} />
                      </div>
                      <span className="text-white/90 text-[15px] font-medium leading-none">RPG Bundle!</span>
                    </div>
                  </div>
                </div>

                {/* Packages Table */}
                <div className="flex flex-col">
                  {[{
                  amount: '24,000',
                  orig: '22,500',
                  bonus: '+ 1500 more',
                  price: '$199.99'
                }, {
                  amount: '11,000',
                  orig: '10,000',
                  bonus: '+ 1000 more',
                  price: '$99.99'
                }, {
                  amount: '5,250',
                  orig: '4,500',
                  bonus: '+ 750 more',
                  price: '$49.99'
                }, {
                  amount: '3,625',
                  orig: '3,150',
                  bonus: '+ 475 more',
                  price: '$34.99'
                }, {
                  amount: '2,000',
                  orig: '1,700',
                  bonus: '+ 300 more',
                  price: '$19.99'
                }].map((pkg, i) => <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors border-t border-white/5 first:border-0 group">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <RobuxIcon size={24} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                          <span className="text-[24px] font-bold tracking-tight">{pkg.amount}</span>
                        </div>
                        <div className="flex items-center gap-1 relative px-0.5">
                          <div className="absolute top-[52%] left-0 right-0 h-[2px] bg-[#a1a1aa] -translate-y-1/2 z-10" />
                          <RobuxIcon size={18} className="text-[#a1a1aa] relative z-0" />
                          <span className="text-[18px] text-[#a1a1aa] font-bold relative z-0 tracking-tight">{pkg.orig}</span>
                        </div>
                        <div className="flex items-center h-6 px-2 rounded-full bg-[rgba(208,217,251,0.12)] text-[rgb(247,247,248)] ml-1">
                          <span className="text-[12px] leading-[12px] font-semibold whitespace-nowrap">
                            {pkg.bonus}
                          </span>
                        </div>
                      </div>
                      <button className="bg-[#232428] hover:bg-[#2b2c31] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors min-w-[120px] text-center flex items-center justify-center">
                        {pkg.price}
                      </button>
                    </div>)}
                </div>
              </div>

              <h2 className="text-xl font-bold mt-10">Robux packages</h2>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 right-6 bg-[#232328] hover:bg-[#2a2a30] text-sm font-semibold px-4 py-2 rounded-lg border border-white/10 shadow-xl transition-transform active:scale-95 z-50">
        Chat
      </button>

      <SendRobuxModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        balance={balance}
        onSent={(amount) => setBalance((b) => Math.max(0, b - amount))}
      />
    </div>;
};
export default RobuxPurchasePage;