import CollectionPage from "./pages/CollectionPage";
import ThemeProvider from "./themes/themeProvider";
import SizeProvider from "./themes/sizeProvider";

function App() {
  return (
    // TODO - join theme and size provider
    <ThemeProvider>
      <SizeProvider>
        <CollectionPage />
      </SizeProvider>
    </ThemeProvider>
  );
}

export default App;
