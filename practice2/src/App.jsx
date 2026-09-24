import Header from "./components/Header";
import About from "./components/About";
import Contact from "./components/Contact";
import avatar from "./assets/Avatar.jpg";

function App() {
  return (
    <div className="page">
      <Header
        name="Nakypbek Nurassyl"
        title="Future backend developer"
        image={avatar}
      />
      <About text="Hi! I am a 4th year student at KBTU. I study Java, Spring. I want to become a backend developer and get my first job in IT."
              skills={["Java", "Git & GitHub", "Linux"]} />
      <Contact
        github="github.com/nrs1wx"
        githubUrl="https://github.com/nrs1wx"
        instagram="@nrsl.wx"
        instagramUrl="https://github.com/nrs1wx"
        address="Planet Earth"
        addressUrl="https://maps.app.goo.gl/CcyjLfHvWuqPK3hM8"
      />
    </div>
  );
}

export default App;
