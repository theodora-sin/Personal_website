import githubIcon from '../assets/github.png';
import linkedinIcon from '../assets/linkedin.png';
import chromeIcon from '../assets/chrome.png';

const LINKS = [
  { icon: githubIcon, label: 'GitHub', url: 'https://github.com/theodora-sin'},
  { icon: linkedinIcon, label: 'LinkedIn', url: 'https://www.linkedin.com/in/theodora-sin-50a714302'},
  {icon:  chromeIcon, label:'Chrome', url:'https://www.google.com'}
];

function QuickLinks() {
  const linkElements = [];

  for (let i = 0; i < LINKS.length; i++) {
    const link = LINKS[i];
    linkElements.push(
      <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="quick-link-icon-only" title={link.label}>
        <img src={link.icon} alt={link.label} className="quick-link-icon-img" />
      </a>
    );
  }

  return <div className="quick-links">{linkElements}</div>;
}

export default QuickLinks;