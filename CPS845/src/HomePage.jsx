import TemplatePage from "./TemplatePage";
import "./main.css";

function HomePage() {

  return (
      <TemplatePage>
          <section className="main-content">
            <div className="calendar">
              <h2>Calendar</h2>
              <ul className="lists">
                <li>project 1 due Friday</li>
              </ul>
            </div>
          </section>
          <section className="main-content">
            <div className="slap-notifications">
              <h2>SLAPs</h2>
              <ul  className="lists">
                <li>System will be down Saturday from 6am-8am</li>
                <li>New Project in class 3</li>
              </ul>
            </div>
          </section>
      </TemplatePage>
  );
}

export default HomePage;
