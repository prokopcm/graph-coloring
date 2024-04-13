<script setup>
const currentYear = new Date().getFullYear()
</script>
<template>
    <section class="site-footer flex flex-col justify-between">
        <!-- <div class="subsection-wrapper pb-8">© {{ currentYear }} by Michael Prokopchuk</div> -->
    </section>
</template>

<style>
.subsection-wrapper {
    margin: auto;
    margin-top: 32px;
}

.insta-link {
    position: relative;
    top: 13px;
}

.instagram {
    width: 20px;
    height: 20px;
    object-fit: cover;
}
</style>