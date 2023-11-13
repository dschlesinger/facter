<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Button } from "$lib/components/ui/button";

    import * as RadioGroup from "$lib/components/ui/radio-group";
    import { Label } from "$lib/components/ui/label";

    import Progress from "$lib/components/ui/progress/progress.svelte";
    
    import { Result } from "postcss";

    import Background from "./Background.svelte";
    
    let url = true;

    let choice = "url";

    let linkURL = "";
    let articleContent = "";

    import { Loader2 } from "lucide-svelte";
    import * as Tabs from "$lib/components/ui/tabs";
    import * as Alert from "$lib/components/ui/alert";
    import { AlertCircle } from "lucide-svelte";

    let predicting = false;
    let prediction: any = null;
    let truth_score: number = 0;
    let rating_color: string = "white";
    let sentence_scores: any[] = [];
    let title:string = "";
    let tone_score:number = 0;
    let sentence_tones:any[] = [];

    let similarParagraphs:string[] = [];
    let domain:string[] = [];
    let similar_url:string[] = [];

    let error = "";

    let indicatorValue = "";
    let toneValue = "";

    async function predict() {
        jnu = 0;
        predicting = true;
        prediction = null;
        error = "";
        indicatorValue = "";
        let theResult: any = null;

        if (choice == "url") {
            let inputs = {
                url: linkURL
            }
            const response = await fetch('/api/url/', {
		    	method: 'POST',
		    	headers: {
		    		'Content-Type': 'application/json'
		    	},
		    	body: JSON.stringify( inputs ),
		    });
            theResult = await response.json();
        } else if (choice == "text") {
            let inputs = {
                text: articleContent
            }
            const response = await fetch('/api/text/', {
		    	method: 'POST',
		    	headers: {
		    		'Content-Type': 'application/json'
		    	},
		    	body: JSON.stringify( inputs ),
		    });
            theResult = await response.json();
        } else {
            return "Error";
        }
        console.log("here");
        console.log(theResult);
        if (theResult[1].length == 0) {
            error = theResult[3];
            console.log(error)
            predicting = false;
            return;
        }
        console.log(theResult);
        truth_score = theResult[0]
		prediction = theResult[1];
        sentence_scores = theResult[2]
        sentence_tones = theResult[3]
        tone_score = theResult[4]
        title = theResult[5]
        similarParagraphs = theResult[6]
        domain = theResult[7]
        similar_url = theResult[8]

        let toneNum = 100-Math.round((1-tone_score)/2*100)
        toneValue = toneNum + "%";

        let indicatorNum = 100-Math.round((1-truth_score)/2*100)
        indicatorValue = indicatorNum + "%";
        if (truth_score < -0.5){
            rating_color = "red"
        }
        else if (truth_score < 0){
            rating_color = "yellow"
        }
        else if (truth_score > 0.5){
            rating_color = "green"
        }
        else {
            rating_color = "lightGreen"
        }
        predicting = false;
        console.log("Here")
    }

    function sentence_score_color(score:number) {

        console.log(score)

        if (score < -0.5) {
            return "lightcoral"
        }
        else if (score < 0) {
            return "yellow"
        }
        else if (score < 0.5) {
            return "green"
        }
        else {
            return "lightGreen"
        }
    }

    let jnu:number = 0;

    function inc(){
        jnu = jnu+1
    }

    function jnum(){
        return jnu
    }

</script>

<div>
    <h1 class="my-4">Tool that automatically analyzes news stories for bias and factually incorrect information <br> More text = more accurate</h1>

    <Tabs.Root bind:value={choice} class="w-80 md:w-96">
        <Tabs.List class="grid w-full grid-cols-2">
          <Tabs.Trigger value="url">URL</Tabs.Trigger>
          <Tabs.Trigger value="text">Text</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="url">
            <Input bind:value={linkURL} type="text" placeholder="URL" class="w-80 md:w-96 my-4"/>
            <p>Enter a URL or text here (Can take up to 30 seconds)</p>
            <p class="pb-6">If it is taking too long, try a shorter article, or try again</p>
        </Tabs.Content>
        <Tabs.Content value="text">
            <Textarea bind:value={articleContent} placeholder="Article Content" class="h-32 w-80 md:w-96 my-4"/>
            <p class="pb-6">Enter text, faster but no cross referrals</p>
        </Tabs.Content>
    </Tabs.Root>
    
    {#if predicting}
    <Button disabled><Loader2 class="mr-2 h-4 w-4 animate-spin"></Loader2>Analyzing...</Button>
    {:else}
    <Button on:click={predict}>Analyze</Button>
    {/if}
</div>

{#if error}
        <Alert.Root class= "border-2 w-96 mt-6 bg-red-200" variant="destructive">
            <AlertCircle class="h-4 w-4" />
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>
                {error}
            </Alert.Description>
        </Alert.Root>
{/if}

{#if prediction}
    <p class="pb-6 pt-3">A higher number means less bias.</p>
    <div class="w-full xl:w-1/2 text-center">
        Bias Score: {Math.round(truth_score * 100)/100}
    </div>

    <div class="w-full lg:w-1/2"><div style="margin-left: {indicatorValue}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </div></div>
    <div class="flex flex-row w-full lg:w-1/2 rounded-lg border border-purple-950">
        <div class="rounded-l-lg basis-1/4 bg-purple-800 border-2 border-[#000000]">&nbsp;</div>
        <div class="basis-1/4 bg-purple-400 border-2 border-[#000000]">&nbsp;</div>
        <div class="basis-1/4 bg-purple-200 border-2 border-[#000000]">&nbsp;</div>
        <div class="rounded-r-lg basis-1/4 bg-white border-2 border-[#000000]">&nbsp;</div>
    </div>

    <div class="w-full xl:w-1/2 text-center  pt-4">
        Tone Score: {Math.round(tone_score * 100)/100}
    </div>

    <div class="w-full lg:w-1/2"><div style="margin-left: {toneValue}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </div></div>
    <div class="flex flex-row w-full lg:w-1/2 rounded-lg">
        <div class="rounded-l-lg basis-1/4 bg-red-500 border-2 border-[#000000]">&nbsp;</div>
        <div class="basis-1/4 bg-yellow-500 border-2 border-[#000000]">&nbsp;</div>
        <div class="basis-1/4 bg-green-200 border-2 border-[#000000]">&nbsp;</div>
        <div class="rounded-r-lg basis-1/4 bg-green-500 border-2 border-[#000000]">&nbsp;</div>
    </div>
    <!--
    <Progress style="background-color:{rating_color};" value={1-truth_score} max={2} class="w-full md:w-1/2 my-4 rotate-180"/>
    -->

    <div class="w-full lg:w-1/2 text-xl text-center mt-4">Title:</div>
    <div class="w-full lg:w-1/2 text-center underline">{ title }</div>

    <div class="w-full lg:w-1/2 min-h-[64] bg-[#000000] p-4 rounded-lg border-2 my-2 border-[#000000]">
        {#each {length: prediction.length} as _, i}
            <div class="w-[100%] z-50 dropdown dropdown-hover max-lg:dropdown-bottom lg:dropdown-right">
                <label tabindex="0">
                    <div class="hover:underline" style="color: {sentence_score_color(sentence_scores[i])}">{ prediction[i] }</div>
                </label>
                <div tabindex="0" class="card compact dropdown-content bg-slate-800 rounded-xl w-64 lg:w-[30rem]">
                    <div class="card-body">
                        <div class="flex flex-col">
                            
                              <h2 class="text-sm font-semibold">Bias Score: {Math.round(sentence_scores[i]* 100)/100} - Tone Score: {Math.round(sentence_tones[i] * 100)/100}</h2>
                              {#if choice == "url" } <!--choice == "url" -->
                                <div class="w-full pt-2">
                                    {#if sentence_scores[i] < -0.5}
                                        <p class="text-sm border-b border-black font-semibold">Similar Articles Say</p>
                                        <div class=" border-b border-black">{ similarParagraphs[jnum()] } </div>
                                        <div class="">{ similar_url[jnum()] }
                                            <!-- {#each similar_url[jnum()] as hurl }
                                                <a href="{ hurl }">{ hurl }</a>
                                            {/each} -->
                                        </div>
                                        { inc() }
                                    {/if}
                              </div>
                              {/if}
                          </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>

{:else}
    <p class="pt-6">See the result here!</p>
{/if}

<div>
    <Background/>
</div>
