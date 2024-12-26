# opdf

I needed a way to generate dynamic PDFs (and not use a headless browser or some other weird workaround).

Here is my plan:
- Generate a source tree using [Acorn](https://github.com/acornjs/acorn) and the [JSX extension](https://github.com/acornjs/acorn-jsx)
- Parse that source tree and generate positions in a page using [Yoga](https://www.yogalayout.dev/)
- Build a PDF using [PDFKit](https://pdfkit.org/) and the positions generated

Using this, hopefully we can take this:
```JSX
<Layout config={{useWebDefaults: false}}>
  <Node style={{width: 250, height: 475, padding: 10}}>
    <Node style={{flex: 1, rowGap: 10}}>
      <Node style={{height: 60}} />
      <Node style={{flex: 1, marginInline: 10}} />
      <Node style={{flex: 2, marginInline: 10}} />
      <Node
        style={{
          position: "absolute",
          width: "100%",
          bottom: 0,
          height: 64,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Node style={{height: 40, width: 40}} />
        <Node style={{height: 40, width: 40}} />
        <Node style={{height: 40, width: 40}} />
        <Node style={{height: 40, width: 40}} />
      </Node>
    </Node>
  </Node>
</Layout>
```

And generate a PDF. We will see.
