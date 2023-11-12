<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Button } from "$lib/components/ui/button";

    import * as RadioGroup from "$lib/components/ui/radio-group";
    import { Label } from "$lib/components/ui/label";

    import Background from "./Background.svelte";
    import '../global.css';
    
    let url = true;

    let linkURL = "";
    let articleContent = "";


    let predicting = false;
    let prediction: any = null;
    async function predict() {
        predicting = true;
        let inputsPred = {
            url: linkURL
        }
        const response = await fetch('/api/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( inputsPred ),
		});
		let resultPred = await response.json();
		resultPred = resultPred;
		predicting = false;
		prediction = resultPred;
    }

</script>

{#if predicting}
Predicting...
{/if}

{#if prediction != null}
    {prediction}
{/if}

<div>
    Tool that analyzes news stroies for bias and factaully incorrect information
    <RadioGroup.Root value="comfortable" class="my-4">
        <div class="flex items-center space-x-2">
          <RadioGroup.Item value="comfortable" id="r1" on:click={() => {url = true}}  />
          <Label for="r1">URL</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroup.Item value="default" id="r2" on:click={() => {url = false}} />
          <Label for="r2">Text</Label>
        </div>
        <RadioGroup.Input name="spacing" />
    </RadioGroup.Root>

    {#if url == true}
    <h1>To test it out, enter a URL here</h1>

    <Input bind:value={linkURL} type="text" placeholder="URL" class="w-96 my-4"/>
    {:else}
    <p>Or paste in text here</p>

    <Textarea bind:value={articleContent} placeholder="Article Content" class="h-32 w-1/2 my-4"/>
    {/if}
    <Button on:click={predict}>Run</Button>

    <!-- <Progress {value} max={100} class="w-[60%]" /> -->
</div>

<Background/>
