import TeamLogo from '../../assets/team-logo.svg';

export function TermsHeader() {
  return (
    <header className="flex flex-col px-4 sm:px-8 md:px-16 lg:px-32 xl:px-60 2xl:px-80 py-6 md:py-9 w-full bg-[#E27625]">
      <div className="flex items-center mb-3 md:mb-5">
        <img
        src={TeamLogo}
        alt="Team Logo"
        className="w-10 h-8 sm:w-12 sm:h-10 md:w-16 md:h-12 lg:w-[64px] lg:h-[52px] mr-3 md:mr-6"
        />
        <h1 className="font-saira-stencil text-white text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">STAKEWISE</h1>
      </div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">TERMS OF USE</h2>
      <p className="text-xs sm:text-sm font-bold text-white">
        Last Updated: <span className="font-normal">December 12, 2024</span>
      </p>
    </header>
  );
}
