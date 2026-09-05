import {projects} from '../data/projects';

function Projects() {
  return (
    <div className="projects-grid">
      {projects.map((p) => (
        <a key={p.title} href={p.link} target="_blank" rel="noopener noreferrer" className="project-card">
          <div className="project-title">{p.title}</div>
          <div className="project-desc">{p.description}</div>
          <div className="project-tags">
            {p.tags.map((tag) => (
              <span key={tag} className="project-tag">{tag}</span>
            ))}
          </div>
        </a>
      ))}
    </div>
  );
}

export default Projects;