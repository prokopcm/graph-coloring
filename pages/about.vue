<template>
    <div>
        <AppMenu selected="about" />
        <div class="content">
            <div class="m-auto">
                <section class="main-content">
                    <p class="subhero-text">Hello! This is math!</p>
                    <div class="spacer"><span>​</span></div>
                    <p class="text-body">TODO.</p>
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