import githubIcon from '../assets/github.svg';
import kappaImage from '../assets/kappa.png';

const InfoCard = () => {
  return (
    <div className="fixed bottom-4 left-4 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg p-3 flex items-center gap-3 border border-border dark:border-border-dark hover:shadow-xl transition-all">
      <a 
        href="https://github.com/cburke6897/URL-Cutr" 
        target="_blank" 
        rel="noopener noreferrer"
        title="App Repository"
        className="hover:opacity-80 hover:scale-120 transition-all rounded-full bg-bg-light dark:bg-bg-dark p-2"
      >
        <img src={githubIcon} alt="GitHub" className="w-6 h-6 dark:invert" />
      </a>
      <a 
        href="https://cburke.netlify.app" 
        target="_blank" 
        rel="noopener noreferrer"
        title="Visit my site"
        className="hover:opacity-80 hover:scale-120 transition-all rounded-full bg-bg-light dark:bg-bg-dark p-2"
      >
        <img src={kappaImage} alt="Kappa" className="w-6 h-6" />
      </a>
    </div>
  );
};

export default InfoCard;