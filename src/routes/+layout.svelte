<script>
    import "../app.css";
    import Header from "./Header.svelte";
    import Footer from "./Footer.svelte";
</script>

<head>
    <title>
        Based Analysis
    </title>
</head>

<Header />
  
<div class="mx-8">
    <slot/>
</div>

<Footer />