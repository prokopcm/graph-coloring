<template>
    <div>
        <AppMenu selected="about" />
        <div class="content">
            <div class="m-auto">
                <section class="main-content">
                    <div class="note">Note: words in <b>bold</b> are good terms to search for in order to dig deeper and further your understanding!</div>
                    <div class="note">Note 2: Despite how visual and intuitive this kind of math can be, it is unfortunately not usually taught until college, so many resources on the topic assume a certain level of mathematical maturity.</div>
                    <div class="spacer"><span>​</span></div>
                    <p class="subhero-text">Coloring maps</p>
                    <p class="text-body">The problem of figuring out the fewest number of colors to color in any map was first formally stated in the 1800s. Mathematicians came up with proofs, but none of them turned out to be correct. This problem went unproven for over 100 years until in 1976, two researchers at the University of Illinois finally proved that any planar map could be colored in with just 4 colors. The proof was controversial at the time and historical nowadays because it was the first math theorem to be proven with computer assistance.</p>

                    <div class="spacer"><span>​</span></div>
                    <p class="subhero-text">Creative math</p>
                    <p class="text-body">The problem of coloring in a map is more formally called <b>graph coloring</b>, and is a problem inside of an area of math called <b>graph theory</b>. Graph theory is the study of graphs and falls under the larger branch of <b>discrete mathematics</b>. Here a graph means one or more locations represented as a circle (a vertex) connected to each other in different ways with lines (edges). This type of graph is very different from the kind in geometry with an x and y axis, but they are both are similar in that they visualize something.</p>
                    <br>
                    <p class="text-body">Applications</p>
                    <div class="spacer"><span>​</span></div>

                    <p class="subhero-text">Computers</p>
                    <p class="text-body">Graph coloring can be thought of a <b>constraint satisfaction problem</b>. A computer solves this problem </p>
                    <div class="spacer"><span>​</span></div>
                    
                    <p class="subhero-text">How to study this more</p>
                    <p class="text-body"></p>
                    <div class="spacer"><span>​</span></div>
                    <p class="subhero-text">Resources</p>
                    <p class="text-body">
                        <a href="https://www.youtube.com/watch?v=NgbK43jB4rQ" target="_blank">Four Color Theorem - Numberphile (YouTube)</a><br>
                        <a href="Math for seven-year-olds: graph coloring, chromatic numbers, and Eulerian paths and circuits" target="_blank">Math for seven-year-olds: graph coloring, chromatic numbers, and Eulerian paths and circuits</a><br>
                        <a href="https://www.geogebra.org/m/Pr3bvbx3" target="_blank">Graph Theory for Kids</a><br>
                        <a href="https://en.wikipedia.org/wiki/Four_color_theorem" target="_blank">Four Color Theorem (Wikipedia)</a><br>
                        <a href="https://discrete.openmathbooks.org/dmoi3.html" target="_blank">Discrete Mathematics: An Open Introduction (Free textbook)</a><br>
                        <a href="https://www.geeksforgeeks.org/dsatur-algorithm-for-graph-coloring/" target="_blank">DSATUR Algorithm for Graph Coloring (warning: code and computer science)</a>
                    </p>

                </section>
                <div class="button-wrapper pt-8">
                    <LinkButton to="/">Take me back to the map</LinkButton>
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
</style>