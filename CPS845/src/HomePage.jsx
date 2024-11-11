import TemplatePage from "./TemplatePage";
import "./main.css";

function HomePage() {

  return (
      <TemplatePage>
          <section className="main-content">
            <div className="calendar">
              <h2>Calendar</h2>
              <p>- project 1 due Friday</p>
            </div>
          </section>
          <section className="main-content">
            <div className="slap-notifications">
              <h2>SLAPs</h2>
              <p>- System will be down Saturday from 6am-8am</p>
              <p>- New Project in class 3</p>
            </div>
          </section>
      </TemplatePage>
  );
}

export default HomePage;
