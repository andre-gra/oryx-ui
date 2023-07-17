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

Sfruttare le teorie sui colori descritte in https://www.radix-ui.com/docs/colors, e creare i vari temi su queset basi. Il sito di oryx.ui permetterà di selezionare i componenti e i loro temi in base a queste palette. Sarebbe figo inserire un sistema che testi il punteggio di accessibilità calcolando coliri e contrasti degli elemnti di una pagina web.

Ogni componente di default prende il tema generale del context. Creare un secondo context specifico per il singolo componente, in modo che si possa scegliere quale utilizzare. utile se si vuole dare enfasi a determinate parti di una pagina.

Il theming si deve poter applicare ai colori, alla dimensione e alle animazioni.

## Componenti
Avremo componenti da richiamare singolarmente e props che gestiranno testi o opzioni per le select.