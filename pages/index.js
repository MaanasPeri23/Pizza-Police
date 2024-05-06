import ReportPizzaForm from "../components/ReportPizzaForm";

export default function Home() {
  return (
    <div>
      <main>
        <section className="hero is-medium is-link" style={{ backgroundColor: '#FCFBF4' }}>
          <div class="hero-body columns is-vcentered">
            <div className="column">
              <p class="title" style={{ color: 'black' }}>The beginning of the pizza revolution.</p>
              <p class="subtitle" style={{ color: 'black' }}>
                A pizza ticket management system where you can report pizza hate crimes from all over the world and we solve them. Join the community today!
              </p>
              <ReportPizzaForm />
              <></>
            </div>
            <div className="column">
              <figure>
                <img src="https://www.shutterstock.com/image-photo/pizza-napoletana-traditional-authentic-italian-600nw-2310712757.jpg" />
              </figure>
            </div>
          </div>
        </section>

        <section class="hero is-medium">
          <div class="hero-body columns is-vcentered">
            <div className="column">
              <figure>
                <img src="https://img.freepik.com/premium-photo/traditional-italian-pizza-pepperoni-with-salami-cheese-dark-background-ai-generated_70626-15294.jpg" />
              </figure>
            </div>
            <div className="column">
              <p class="title">
                Have Pizza Police sent to your location in real time.
              </p>
            </div>
          </div>
        </section>

        <section class="hero is-medium has-background-white-ter	">
          <div class="hero-body columns is-vcentered">
            <div className="column">
              <p class="title">Abolish the tyranny that is chicago "deep dish" pizza. </p>
              <p>insert evil laughter here</p>
            </div>
            <div className="column">
              <figure>
                <img src="https://media1.giphy.com/media/gL2uUryS7WQYhlEIeR/giphy.gif?cid=82a1493bscs8qiv3f26nb28ipsqye9y32zo1ac2y5qjc4ebc&ep=v1_gifs_search&rid=giphy.gif&ct=g" />
              </figure>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
