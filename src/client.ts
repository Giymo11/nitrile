export {};

import {
  LitElement,
  html,
  css,
  customElement,
  property,
} from "https://cdn.skypack.dev/lit-element@2.4.0";

import { until } from "https://cdn.skypack.dev/lit-html@1.3.0/directives/until.js";

const x = 1 * 2;
console.log("Hello World from client.ts; " + x);

interface Movie {
  href: string;
  title: string;
  year: number;
  tags: string[];
  synopsis: string;
  rt_critics: string;
  rt_audience: string;
  imdb: string;
  directors: Person[];
  actors: Actor[];
  poster_src: string;
  download: {
    src: string;
    quality: string;
  };
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
}

interface Person {
  name: string;
  avatar_src: string;
}

interface Actor extends Person {
  role: string;
}

@customElement("nitrile-book")
class NitrileBook extends LitElement {
  @property() src = "/static/movies.json";

  async fetchMovies(src: string) {
    const data = await fetch(src);
    const jason = await data.json();
    const movies: Movie[] = Object.values(jason.movies);
    console.log(movies);
    return movies;
  }

  renderMovies(movies: Movie[]) {
    return movies.map(
      (movie) => html`<nitrile-movie .movie=${movie}></nitrile-movie>`
    );
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
    `;
  }

  render() {
    return html`
      ${
        // renderes the later supplied parameters while the previous are unavailable
        until(
          this.fetchMovies(this.src).then(this.renderMovies),
          html`<p>Loading...</p>`
        )
      }`;
  }
}

const typographyStyle = css`
h1 {
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 48pt;
}

p {
  font-family: 'EB Garamond', serif;
  font-weight: 400;
  font-size: 12pt;
  line-height: 140%;
}
`

@customElement("nitrile-movie")
class NitrileMovie extends LitElement {
  @property() movie: Movie | null = null;

  static get styles() {
    return css`
      :host {
        width: 14.8cm;
        height: 21.0cm;
        display: flex;
        flex-direction: row;
      }

      nitrile-peek {
        flex: 1;
        color: coral;
      }

      nitrile-main {
        flex: 1.618;
      }
    `;
  }

  renderMovie(movie: Movie) {
    return html`
      <nitrile-peek .movie=${movie}></nitrile-peek>
      <nitrile-main .movie=${movie}></nitrile-main>
    `;
  }

  render() {
    if (this.movie === null) return html`<h1>No movie specified!</h1>`;
    else return this.renderMovie(this.movie);
  }
}

@customElement("nitrile-peek")
class NitrilePeek extends LitElement {
  @property() movie: Movie | null = null;

  static get styles() {
    return [
      typographyStyle
    ]
  }

  renderMovie(movie: Movie) {
    return html`<p>${movie.actors[0].name}</p>`;
  }

  render() {
    if (this.movie === null) return html`<h1>No movie specified!</h1>`;
    else return this.renderMovie(this.movie);
  }
}

@customElement("nitrile-main")
class NitrileMain extends LitElement {
  @property() movie: Movie | null = null;

  static get styles() {
    return [
      typographyStyle
    ]
  }

  renderMovie(movie: Movie) {
    return html`<h1>${movie.title}</h1>`;
  }

  render() {
    if (this.movie === null) return html`<h1>No movie specified!</h1>`;
    else return this.renderMovie(this.movie);
  }
}
