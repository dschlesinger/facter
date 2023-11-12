<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Button } from "$lib/components/ui/button";

    import Background from "./Background.svelte";
    import '../global.css';
</script>

<div>
    <h1>To test it out, enter a URL here</h1>

    <Input type="text" placeholder="URL" class="w-96 my-4"/>

    <p>Or paste in text here</p>

    <Textarea placeholder="Article Content" class="h-32 w-1/2 my-4"/>

    <Button>Run</Button>
</div>

<Background/>