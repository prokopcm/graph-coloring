<template>
  <!-- eslint-disable no-irregular-whitespace -->
  <div>
    <AppMenu selected="about" />
    <div class="content">
      <div class="m-auto">
        <section class="main-content">
          <div class="mb-2 mt-2 note">
            Note: words in <b>bold</b> are good terms to search for in order to dig deeper and further your understanding!
          </div>
          <div class="spacer">
            <span>​</span>
          </div>
          <a class="pdf-link" target="_blank" href="/map-coloring-handout.pdf">
            <img class="pdf-image" src="/img/pdf.jpg">Download a printable PDF handout!
          </a>
          <div class="spacer">
            <span>​</span>
          </div>
          <p class="subhero-text">
            Coloring maps
          </p>
          <p class="text-body">
            The problem of figuring out the fewest number of colors to color in any map was first formally stated in the 1800s. Mathematicians came up with proofs, but none of them turned out to be correct. This problem went unproven for over 100 years until in 1976, two researchers at the University of Illinois finally proved the <b>four color theorem</b>. This theorem states that any planar map can be colored in with just 4 colors. The proof was controversial at the time and historical nowadays because it was the first math theorem to be proven with computer assistance.
          </p>

          <div class="spacer">
            <span>​</span>
          </div>
          <p class="subhero-text">
            Creative math
          </p>
          <p class="text-body">
            The problem of coloring in a map is more formally called <b>graph coloring</b>, and is a problem inside of an area of math called <b>graph theory</b>. Graph theory is the study of webs (or <i>networks</i>) of data and how pieces of data connect to and relate to each other. Graph theory is categorized under the larger branch of <b>discrete mathematics</b>. Here a graph means one or more locations represented as a circle (a vertex) connected to each other in different ways with lines (edges). This type of graph is very different from the kind in geometry with an x and y axis, but they are both are similar in that they visualize something.
          </p>
          <img class="midwest-img" src="/img/midwest.svg">
          <div class="spacer">
            <span>​</span>
          </div>

          <p class="subhero-text">
            Computers
          </p>
          <p class="text-body">
            Graph coloring can be thought of a <b>constraint satisfaction problem</b>. A computer solves this problem by simply following a list of steps, like following a recipe in a cookbook. This list of steps is called an algorithm.
            Here are some steps taken from real algorithms to help you think like a computer:
          </p>
          <ul class="algorithm-steps list-disc list-inside">
            <li>
              Start with a state that touch lots of other states first. They are tricky to color in if
              other nearby states have already been colored in first.
            </li>
            <li>Don't add another color unless you have to. Reuse colors as often as possible.</li>
            <li>
              Color in states that have fewer color options left to choose from before coloring in
              states that have more colors left to choose from.
            </li>
          </ul>

          <div class="spacer">
            <span>​</span>
          </div>
          <p class="subhero-text">
            Applications
          </p>
          <p class="text-body">
            People need to solve these types of graph coloring problems to schedule planes at airports, figure out classroom schedules for teachers and students, let phones and computers to run multiple programs at once, create circuit boards, and to create and solve puzzles like sudoku.
          </p>

          <div class="spacer">
            <span>​</span>
          </div>
          <p class="subhero-text">
            How to study this more
          </p>
          <p class="text-body">
            Graph theory and graph coloring is usually taught as a part of a college class in discrete mathematics. Solving constraint satisfaction problems with algorithms is taught in computer science courses in algorithms as well as artificial intelligence. If you study computer science, mathematics, or engineering, you'll likely have an opportunity to study this subject more thoroughly.
          </p>
          <div class="spacer">
            <span>​</span>
          </div>
          <p class="subhero-text">
            Resources
          </p>
          <p class="text-body">
            <a href="https://www.youtube.com/watch?v=NgbK43jB4rQ" target="_blank">Four Color Theorem - Numberphile (YouTube)</a><br>
            <a href="https://www.geogebra.org/m/Pr3bvbx3" target="_blank">Graph Theory for Kids</a><br>
            <a href="https://jdh.hamkins.org/math-for-seven-year-olds-graph-coloring-chromatic-numbers-eulerian-paths/" target="_blank">Math for seven-year-olds: graph coloring, chromatic numbers, and Eulerian paths and circuits</a>
          </p>
          <div class="mt-4 note">
            Resources below this point assume a high level of mathematical maturity...beware of formulas and jargon!
          </div>
          <p class="text-body">
            <a href="https://en.wikipedia.org/wiki/Four_color_theorem" target="_blank">Four Color Theorem (Wikipedia)</a><br>
            <a href="https://discrete.openmathbooks.org/dmoi3.html" target="_blank">Discrete Mathematics: An Open Introduction (Free textbook)</a><br>
            <a href="https://www.geeksforgeeks.org/dsatur-algorithm-for-graph-coloring/" target="_blank">DSATUR Algorithm for Graph Coloring (warning: code and computer science)</a>
          </p>
          <br><br>
          <div class="intro">
            <i>
              <!-- I presented this at the 2024 Michigan State University science festival along with Benyair Orellana, another computer science graduate student at Georgia Tech, as a way to introduce the public and prospective future scientists to a fun, interesting, and valuable type of math often not encountered until college. Because of its inherently visual nature (the "graph" in graph theory comes from the same Greek root as "graphics"), the intuition behind a lot of it is simple and accessible, even if you aren't a computer scientist! -->
              <br>
              I wanted to share an area of theory and math that is both fun and different from most people's conception of math. My hope is that participants will come away with a broader, more creative definition of mathematics and have a positive interaction with math while solving a complex equation with 50 states...er, I mean variables.</i>
          </div>
        </section>
        <div class="button-wrapper pt-8">
          <LinkButton to="/">
            Take me back to the map
          </LinkButton>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
a {
    text-decoration: underline;
}

.content {
    margin: auto;
    max-width: 940px;
}

.main-content {
    margin: auto;
}

.hero-image-wrapper {
    padding: 52px 0px;
}

.header {
    font: var(--font_6);
    /* font-weight: 300; */
    text-align: left;
}

.subhero-text {
    font-size: 24px;
    text-align: left;
    line-height: 2.2rem;
}

.text-body {
    text-align: left;
    max-width: none;
}

.note {
    text-align: left;
    background: #faf6de;
    padding: 12px;
    border-radius: 4px;
}

.algorithm-steps {
    text-align: left;
    list-style-type: disc;
    margin: auto;
    padding: initial;
    list-style: disc;
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
    unicode-bidi: isolate;
}

.pdf-image {
    width: 40px;
    height: 50px;
    margin-right: 8px;
    display: inline-block;
}
.midwest-img {
    margin: auto;
    display: block;
}
.intro {
    text-align:left;
}
li {
  display: list-item;
  height: auto;
}
</style>
