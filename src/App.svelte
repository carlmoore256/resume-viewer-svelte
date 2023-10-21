<script lang="ts">
  import Resume from "./components/Resume.svelte";
  import type { ResumeData } from "./lib/resume-types";
  import textureImage from "./assets/white-texture.jpg";

  import DescriptionMap from "./components/DescriptionMap.svelte";

  let resumeData: ResumeData;
  let isLoading = true;

  import("./data/resume-carl-moore.json").then(data => {
    resumeData = data as ResumeData;
    isLoading = false;
  });
</script>

<div class="container">
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <main>
      <DescriptionMap/>
      <Resume resumeData={resumeData}/>
    </main>
  {/if}
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    min-height: 100vh;   /* for vertical centering */
    padding: 10px;
  }

  main {
    max-width: 1000px;
    width: 100%; /* ensure it takes the full width up to 600px */
  }
</style>