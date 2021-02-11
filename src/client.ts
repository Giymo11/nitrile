export {};

import {
  LitElement,
  html,
  css,
  unsafeCSS,
  customElement,
  property,
} from "https://cdn.skypack.dev/lit-element@2.4.0";

import { until } from "https://cdn.skypack.dev/lit-html@1.3.0/directives/until.js";
import { unsafeHTML } from "https://cdn.skypack.dev/lit-html@1.3.0//directives/unsafe-html.js";
import Color from "https://cdn.skypack.dev/ac-colors@1.4.2";

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

const replaceLastTwoSpaces = function (text: string, spaces: number) {
  const lastSpace = spaces == 2 ? /\S+ \S+ \S+\s*$/g : /\S+ \S+\s*$/g
  const lastWords = text.match(lastSpace);
  text = text.replace(lastSpace, "");
  console.log(text);
  return html`${text}<nobr>${lastWords}</nobr>`;
};

@customElement("nitrile-book")
class NitrileBook extends LitElement {
  @property() src = "/static/movies.json";

  async fetchMovies(src: string) {
    const data = await fetch(src);
    const jason = await data.json();
    const movies: Movie[] = Object.values(jason.movies);
    const sortedMovies = movies.sort(
      (m1: Movie, m2: Movie) => m1.year - m2.year
    );

    console.log(sortedMovies);
    return sortedMovies;
  }

  renderMovies(movies: Movie[]) {
    return movies.map(
      (movie, index) => html` <nitrile-movie
        .movie=${movie}
        class=${index % 2 == 0 ? "" : "reverse"}
      ></nitrile-movie>`
    );
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        grid-template-columns: 1fr;
      }
    `;
  }

  render() {
    return html` ${
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
    font-family: "Oswald", sans-serif;
    font-weight: 600;
    font-size: 45pt;
    text-align: center;
  }

  p,
  h2,
  span {
    font-family: "EB Garamond", serif;
    font-weight: 400;
    font-size: 13pt;
    line-height: 140%;
  }

  h2 {
    font-size: 24pt;
  }
`;

@customElement("nitrile-movie")
class NitrileMovie extends LitElement {
  @property() movie: Movie | null = null;
  @property() color = createColor(Color.random());

  static get styles() {
    return css`
      :host {
        width: 14.81cm;
        /* height: 20.93cm; */
        height: 20.9815cm;
        display: flex;
        overflow: hidden;
        flex-direction: row;
      }
      :host-context(.reverse) {
        flex-direction: row-reverse;
      }
      nitrile-peek {
        flex: 1;
      }

      nitrile-main {
        flex: 1.618;
      }
    `;
  }

  renderMovie(movie: Movie) {
    return html`
      <nitrile-peek .movie=${movie} .color=${this.color}></nitrile-peek>
      <nitrile-main .movie=${movie} .color=${this.color}></nitrile-main>
    `;
  }

  render() {
    if (this.movie === null) return html`<h1>No movie specified!</h1>`;
    else return this.renderMovie(this.movie);
  }
}

@customElement("nitrile-rating")
class NitrileRating extends LitElement {
  @property() movie: Movie | null = null;

  static get styles() {
    return [
      typographyStyle,
      css`
        :host {
          border: #111;
          border-style: solid;
          border-width: 1px;
          padding: 2px;
          display: grid;
          grid-template-columns: 1fr 2fr;
          align-items: center;
        }

        span {
          padding: 2px 4.5px;
          line-height: 100%;
        }

        span:nth-of-type(odd) {
          text-align: right;
          font-size: 14pt;
        }

        span:nth-of-type(even) {
          text-align: left;
          font-size: 12pt;
        }
      `,
    ];
  }

  renderMovie(movie: Movie) {
    return html`
      <span>${movie.imdb}</span>
      <span>IMDB</span>
      <span>${movie.rt_audience}</span>
      <span>RT Audience</span>
      <span>${movie.rt_critics}</span>
      <span>RT Critics</span>
    `;
  }

  render() {
    if (this.movie === null) return html`<h1>No movie specified!</h1>`;
    else return this.renderMovie(this.movie);
  }
}

@customElement("nitrile-person")
class NitrilePerson extends LitElement {
  @property() person: Person | Actor | null = null;

  static get styles() {
    return [
      typographyStyle,
      css`
        :host {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        img {
          border-radius: 50%;
          height: 36px;
          width: 36px;
        }
        :host > span {
          font-size: 11pt;
          padding-left: 9px;
        }
        span {
          font-size: 10pt;
        }
      `,
    ];
  }

  renderPerson(person: Person | Actor) {
    const result = html`
      <img src=${person.avatar_src} />
      ${"role" in person && person.role !== ""
        ? html`<span>${person.name}</br><span>as ${person.role}</span></span>`
        : html`<span>${person.name}</span>`}
    `;

    return result;
  }

  render() {
    if (this.person === null) return html`<h1>No person specified!</h1>`;
    else return this.renderPerson(this.person);
  }
}

const createColor = function (color: typeof Color) {
  const reference = new Color({ color: "#D1F0CF", type: "hex" }).lchab;
  const target = color.lchab;

  const result = new Color({
    color: [reference[0], reference[1], target[2]],
    type: "lchab",
  });

  console.log(result);
  return result;
};

@customElement("nitrile-peek")
class NitrilePeek extends LitElement {
  @property() movie: Movie | null = null;
  @property() color = createColor(Color.random());

  static get styles() {
    return [
      typographyStyle,
      css`
        :host {
          padding: 24px 18px 24px 24px;
          
        }
        nitrile-rating {
          margin: 9px 0;
        }
        nitrile-person {
          margin: 9px 0;
        }
        img {
          width: calc(100% + 2*18px - 2px);
          margin: 0px 0 0px 0px;
          border: #000 solid 5px;
        }
        :host-context(.reverse) > img {
          margin: 0px 0 0px -36px;
        }

        h2 {
          margin: 0;
          margin-top: -9px;
        }
        :host-context(.reverse) > h2 {
          text-align: right;
        }
        :host-context(.reverse) {
          padding: 24px 24px 24px 18px;
        }
        .genres {
          text-align: center;
          height: 38px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
        }
        span {
          font-size: 9.5pt;
        }
      `,
    ];
  }

  renderMovie(movie: Movie) {
    return html`
      <style>
        :host {
          background-color: ${this.color.rgbString};
        }
      </style>
      <h2>${movie.year}</h2>
      <p class="genres">
        <span>${replaceLastTwoSpaces(movie.tags.join(" | "), 2)}</span>
      </p>
      <nitrile-rating .movie=${movie}></nitrile-rating>
      ${movie.directors.map(
        (director) =>
          html`<nitrile-person .person=${director}></nitrile-person>`
      )}
      <img src=${movie.poster_src} />
      ${movie.actors.map(
        (actor) => html`<nitrile-person .person=${actor}></nitrile-person>`
      )}
    `;
  }

  render() {
    if (this.movie === null) return html`<h1>No movie specified!</h1>`;
    else return this.renderMovie(this.movie);
  }
}

@customElement("nitrile-main")
class NitrileMain extends LitElement {
  @property() movie: Movie | null = null;
  @property() color = createColor(Color.random());

  static get styles() {
    return [
      typographyStyle,
      css`
        :host {
          display: flex;
          flex-direction: column;
          margin: 42px;
        }
        .title-container {
          display: flex;
          margin: 0 -13px;
          flex: 0;
          width: calc(100% + 18px);
          min-height: 140px;
          justify-content: center;
          align-items: center;
        }
        h1 {
          flex: 0;
          margin: 0;
          text-align: center;
          min-width: 100%;
        }
        h1.long {
          font-size: 36pt;
        }
        h1.verylong {
          font-size: 27pt;
        }
        h1.superlong {
          font-size: 22pt;
        }

        p {
          flex: 1;
        }
        p.long {
          font-size: 12pt;
        }
        p.verylong {
          font-size: 11pt;
        }
        p.superlong {
          font-size: 10pt;
        }

        .personal-rating {
          flex: 0;
          flex-basis: 140px;
          border: #d9d9d9;
          border-width: 15px;
          border-style: solid;
          text-align: center;
        }

        .personal-rating > span {
          line-height: 165%;
        }
      `,
    ];
  }

  renderMovie(movie: Movie) {
    const titleClass =
      movie.title.length >= 40
        ? "superlong"
        : movie.title.length >= 24
        ? "verylong"
        : movie.title.length >= 17
        ? "long"
        : "";

    const factor = 30

    const synopsisClass =
      movie.synopsis.length >= factor*30
        ? "superlong"
        : movie.synopsis.length >= factor*23
        ? "verylong"
        : movie.synopsis.length >= factor*17
        ? "long"
        : "";

    return html`
      <div class="title-container">
        <h1 class=${titleClass}>${movie.title}</h1>
      </div>
      <p class=${synopsisClass}>${replaceLastTwoSpaces(movie.synopsis, 1)}</p>
      <div class="personal-rating" style="border-color: ${this.color.rgbString}">
      <span>Notes</span>
      </div>
    `;
  }

  render() {
    if (this.movie === null) return html`<h1>No movie specified!</h1>`;
    else return this.renderMovie(this.movie);
  }
}
