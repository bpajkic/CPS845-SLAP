import { useParams, Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="container">
      {/* sidebar */}
      <aside className="sidebar">
        <nav className="menu">
          <div className="menu-item">home</div>
          <div className="menu-item">classes</div>
          <ul className="submenu">
            <li className="submenu-item">class 1</li>
            <li className="submenu-item">class 2</li>
            <li className="submenu-item">class 3</li>
          </ul>
          <ul>
          <li>
            <Link to="/home/ViewCourses">View Courses</Link> {/* Using Link for navigation */}
          </li>
        </ul>
        </nav>
        <h2 id="chat">Chat</h2>
        <nav className="chat-menu">
          <ul className="chat-submenu">
            <li className="submenu-item">class 1 (1)</li>
            <ul className="chat-options">
              <li>project 1 (1)</li>
              <li>John Doe (1)</li>
              <li>all</li>
              <li>TA</li>
              <li>Instructor</li>
            </ul>
            <li className="submenu-item">class 2</li>
            <li className="submenu-item">class 3</li>
          </ul>
        </nav>
      </aside>
      {/* main */}
      <main className="content">
        <header className="header">
          <h1>SLAP Interface</h1>
          <button className="logout">LOGOUT</button>
        </header>
        <h4>Gould Street University</h4>
        <section className="main-content">
          <div className="calendar">
            <h2>Calendar</h2>
            <p>- project 1 due Friday</p>
            <button className="show-more">show more</button>
          </div>
        </section>
        <section className="main-content">
          <div className="slap-notifications">
            <h2>SLAPs</h2>
            <p>- System will be down Saturday from 6am-8am</p>
            <p>- New Project in class 3</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
