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
