<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    <NuxtLink v-for="p in programs" :key="p.title" :to="`/${p.slug}`" class="group relative overflow-hidden rounded-xl border border-border p-6 text-white transition-transform hover:scale-102 block">
      <img :src="p.bgImg" alt="program background" class="absolute inset-0 object-cover w-full h-full z-0" />
      <div class="absolute inset-0 bg-black/80 group-hover:bg-black/60 transition-colors z-10" />
      <div class="relative z-20">
        <div class="flex items-center gap-3 mb-4">
          <img :src="p.icon" :alt="p.title" class="w-10 h-10 rounded" />
          <h3 class="text-xl font-display font-bold">{{ p.title }}</h3>
        </div>
        <p class="text-sm text-white/80 leading-relaxed">{{ p.desc }}</p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const programs = [
  {
    slug: "flavortown",
    icon: "https://cdn.hackclub.com/rescue?url=https://hc-cdn.hel1.your-objectstorage.com/s/v3/4cb9a1d8b4650970_image__4_.png",
    title: "Flavortown",
    desc: "Hack on personal coding projects, ship them and get free prizes. Running from December 22nd to March 31st.",
    bgImg: "https://cdn.hackclub.com/rescue?url=https://hc-cdn.hel1.your-objectstorage.com/s/v3/c2cba3b081ea5943_frame_1.png",
  },
  {
    slug: "sleepover",
    icon: "https://cdn.hackclub.com/019cb51b-3772-71e5-ab48-da8f5c8d2ffa/image.png",
    title: "Sleepover",
    desc: "Build projects, fly to an all girls hackathon in Chicago.",
    bgImg: "https://cdn.hackclub.com/019cb51b-3a1a-742e-b765-6d80a1f8ecd9/image.png",
  },
  {
    slug: "slack",
    icon: "https://cdn.hackclub.com/019c1a5e-1a3f-78bf-b317-d341398b7c5b/image.png",
    title: "Hack Club Slack",
    desc: "Join the Slack to find the community for your favorite programming language, ask for advice, or just hang out.",
    bgImg: "https://cdn.hackclub.com/019c1a5e-a76f-7b1a-8a9b-0db3bc1f9d13/ddsad.png",
  },
  {
    slug: "blueprint",
    icon: "https://cdn.hackclub.com/019c1a5f-6a2a-78c1-9e14-0d67623edf91/icon.png",
    title: "Blueprint",
    desc: "Build cool hardware projects (or learn how to) and get up to $400 to make them real!",
    bgImg: "https://cdn.hackclub.com/019c1a60-75a5-7de7-a49d-62c62fb06f32/2026_02_01_0ls_Kleki.png",
  },
  {
    slug: "stasis",
    icon: "https://cdn.hackclub.com/019cb70b-096a-7412-9625-9fa77be951b1/image__192_.png",
    title: "Stasis",
    desc: "Make hardware projects -> fly to a hardware hackathon in Austin, Texas.",
    bgImg: "https://cdn.hackclub.com/019cb713-1e85-7916-a0f4-555d6aa0fa4a/image_1__13_.png",
  },
  {
    slug: "fallout",
    icon: "https://cdn.hackclub.com/019ce03a-13c1-7723-b8be-85d1e96268d2/soup.webp",
    title: "Fallout",
    desc: "Build hardware projects, track your hours, then attend a hardware hackathon in Shenzhen!",
    bgImg: "https://cdn.hackclub.com/019ce02f-ed7b-7b9f-bf91-84503a43c535/bg.webp",
  },
];
</script>
