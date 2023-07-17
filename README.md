## sizing components

Per gestire le dimensioni dei componenti viene utilizzato tailwind insieme ai plugins postcss-nested e postcss-advanced-variables, in mod da poter utilizzare le funzionalita' di scss e usare le variabili e le funzioni per css.

Esempio di come viene gestita la gestione delle dimensione per la select
@each $size $i in (sm, base, lg) {
  .select-trigger-$(size) {
    @apply inline-flex items-center justify-center rounded px-$size text-$size leading-none h-$size gap-[5px] shadow-[0_2px_10px] shadow-black/10 hover:bg-rose-800 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none;

    .select-icon {
      size: $(size);
    }
  }
}

## Theming
Creata una cartella theme dove è stata creato un theme provider, un custom hook che permette di utilizzare il provider e un componente Select per selezionare il tema, che viene anche salvato nel localStorage. Se non già presente nel localStorage di default è light.
Le opzioni sono gestite da Typescript: per il momento abbiamo 'light' e 'dark', ma vorrei aggiungerne altre.
Attualmente viene usato il plugin per tailwind https://github.com/L-Blondy/tw-colors, in modo da gestire la combinazione teme/colori.