/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 8. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Cismi açalım', en: 'Let’s open a solid',
      note: 'Bir cismi kenarlarından kesip düzleme açarsak hangi şekiller çıkar? Buna yüzey açınımı diyoruz.' },
    { scene: 2, start: 10.8, end: 19.2, tr: 'Prizmanın açınımı', en: 'The net of a prism',
      note: 'Dik üçgen prizmayı açalım. İki eş üçgen: bunlar tabanlar.' },
    { scene: 2, start: 19.4, end: 27.8, tr: '3 dikdörtgen', en: 'Three rectangles',
      note: 'Yan yüzler üç dikdörtgen. Enleri taban kenarları, boyları prizmanın yüksekliği. Taban beşgen olsaydı beş dikdörtgen olurdu.' },
    { scene: 3, start: 28.8, end: 37.2, tr: 'Piramidin açınımı', en: 'The net of a pyramid',
      note: 'Dikdörtgen dik piramidin tepe noktası tabanın ortasının tam üstünde. Açınca ortada bir dikdörtgen taban var.' },
    { scene: 3, start: 37.4, end: 45.8, tr: '4 ikizkenar üçgen', en: 'Four isosceles triangles',
      note: 'Yan yüzler dört ikizkenar üçgen; karşılıklı olanlar eş. Kapatınca hepsi tepe noktasında buluşur.' },
    { scene: 4, start: 46.8, end: 55.0, tr: 'Silindiri açalım', en: 'Let’s open a cylinder',
      note: 'Silindirin yan yüzünü açalım. Daire bir tur yuvarlanınca çevresi kadar yol alıyor: yan yüz bir dikdörtgen.' },
    { scene: 4, start: 55.2, end: 63.8, tr: '2 daire, 1 dikdörtgen', en: 'Two circles, one rectangle',
      note: 'İki eş daire tabanlar. Dikdörtgenin eni silindirin yüksekliği, boyu tabanın çevresi: 2 pi r.' },
    { scene: 5, start: 64.8, end: 72.0, tr: 'Koniyi açalım', en: 'Let’s open a cone',
      note: 'Koninin yan yüzü açılınca bir daire dilimi oluyor. Tabanı bir daire.' },
    { scene: 5, start: 72.2, end: 79.8, tr: 'Yay = çevre', en: 'Arc = circumference',
      note: 'Dilimin yarıçapı koninin ana doğrusu. Yayın uzunluğu tabanın çevresine eşit, çünkü kapanınca üst üste gelirler.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Taban ve yan yüzler', en: 'Bases and lateral faces',
      note: 'Aklında kalsın: prizma iki taban ve dikdörtgenler, piramit bir taban ve üçgenler.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Daire ve daire dilimi!', en: 'A circle and a sector!',
      note: 'Silindir iki daire ve bir dikdörtgen; koni bir daire ve bir daire dilimi!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
