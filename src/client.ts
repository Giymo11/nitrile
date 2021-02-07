export {};

import {
    LitElement,
    html,
    css,
    customElement,
    property,
  } from "https://cdn.skypack.dev/lit-element@2.4.0";


const x = 1 * 2;
console.log("hello from client " + x);

@customElement("nitrile-test")
class NitrileTest extends LitElement {
  @property() name = 'World';
  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}

const data = await fetch('/static/movies.json');
const jason = await data.json();
const movies: Movie[] = Object.values(jason.movies);
console.log(movies)

interface Person {
  name: string,
  avatar_src: string,
}

interface Actor extends Person {
  role: string,
}

interface Movie {
  href: string,
  title: string,
  year: number,
  tags: string[],
  synopsis: string,
  rt_critics: string,
  rt_audience: string,
  imdb: string,
  directors: Person[],
  actors: Actor[],
  poster_src: string,
  download: {
    src: string,
    quality: string,
  },
  // deno-lint-ignore no-explicit-any
  [key: string]: any,

}


@customElement("nitrile-movie")
class NitrileMovie extends LitElement {
  @property() movie: Movie | null = null;

  renderMovie(movie: Movie) {
    return html`<h1>${movie.title}</h1>`;
  }

  render() {
    if(this.movie === null)
      return html`<h1>No movie specified!</h1>`;
    else
      return this.renderMovie(this.movie);
  }
}

@customElement("nitrile-book")
class NitrileBook extends LitElement {
  @property() name = 'World';
  render() {
    return html`<div>
      Hello!
      ${movies.map(movie => html`<nitrile-movie .movie=${movie}></nitrile-movie>`)}
    </div>`;
  }
}

