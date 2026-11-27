const VERSION = '8a07834f1609-52356c31';
const PRECACHE = ["./","_expo/static/js/web/index-8a07834f16096ede74bc0439cf02ad86.js","assets/assets/animals/beruska.fe0c7d786f81767b70752204e1c71898.png","assets/assets/animals/cvrcek.11ab4da4ee4d51fe9cff8b8819a528cc.png","assets/assets/animals/holub.bab24eac56a492636586505fa619f89a.png","assets/assets/animals/jesterka.1f38071611d5b0247a07728e4c28fb1b.png","assets/assets/animals/jezek.9bbce9ad0378597db05a7b481e9f4bdd.png","assets/assets/animals/kachnicka.3609957e071ad3f2bbe2e5110be89031.png","assets/assets/animals/kamzik.62b60cfa91d5623374a9d7489ba7037d.png","assets/assets/animals/kocicka.842974fabb8c9265e4f7a51bf860eb5a.png","assets/assets/animals/kos.f36f87193bf8dead54f64096a287f53b.png","assets/assets/animals/krab.4cbfb232bb734da25e19a851f320535f.png","assets/assets/animals/krtek.c9a7202607288ca3fc588d2a0052b660.png","assets/assets/animals/lenochod.e4f5e167d63413ce208216f6c08ac02c.png","assets/assets/animals/liska.1233ff8e56d80a14f39549b9f340e8f1.png","assets/assets/animals/medvidek.19c5902d556570ffe619b4dbdf96cb68.png","assets/assets/animals/morska-zelvicka.d5c0081f31c665cf0a4d372784ebd0c2.png","assets/assets/animals/motyl.5ed56a3278c06c7632c2f4ce2ad7b937.png","assets/assets/animals/mura.19bf866865b50c84d141470a1b6f7082.png","assets/assets/animals/opicka.927a3798d6d4b2806eb2eb51ebd52a42.png","assets/assets/animals/orlik.7fd3a0d14cc348b8765438d626329d45.png","assets/assets/animals/ovecka.30b2993cc211672b35f1770079b41f2c.png","assets/assets/animals/papousek.52578e8fd6b66c69ec30085f3bf3fcf7.png","assets/assets/animals/plch.8c3ee6505bb656eef42f14d99a0a2f1c.png","assets/assets/animals/racek.e95df8deb5d12ba658ffdb60c28f009c.png","assets/assets/animals/rybka.d4a0e96adb254414e9e886702949b16b.png","assets/assets/animals/snek.57fbdd9013e40ca3a1d1a1e41d94de59.png","assets/assets/animals/sova.eb9285bed2134ebf5e8d673480a607e8.png","assets/assets/animals/srnka.2cd1b2b1267e4bafa4ae6255c3ca6c31.png","assets/assets/animals/svetluska.ef5623b633ff875b7b1cc324695dfedc.png","assets/assets/animals/svist.ec32df3c8d119c4c9851e51e7ab6ba9e.png","assets/assets/animals/sykorka.2a2a74a3a7ed877d504eddf4700bcfb3.png","assets/assets/animals/tucnak.1df652af15d33c288386d5568117ef60.png","assets/assets/animals/tukan.04588086ee6594c31292998e7ebcf51a.png","assets/assets/animals/tulen.7385e0bb1e6d3f54b910aa88e95c1312.png","assets/assets/animals/vazka.e0637c7f8255723c4889ffc985738b4d.png","assets/assets/animals/vcelka.3a9b4121bfe4f44d2f1a55faaf3b2fbb.png","assets/assets/animals/velbloudik.85f396071fa6ab564b1676d2906c9da2.png","assets/assets/animals/veverka.565cacbaafd988d248a5421e571d4898.png","assets/assets/animals/vrabec.05d9e1fb927ae6ed2c925ce777f4fbaa.png","assets/assets/animals/zajicek.1bb1c952ff23b80706a9c131929076c7.png","assets/assets/animals/zelvicka.93692dd670506a5bf2c428ea57c8dc1e.png","assets/assets/animals/zizala.2aaecce306fdf7663c72a55e581fc845.png","assets/assets/audio/blup.da37edd93cbd6351e28eecc677e2df34.wav","assets/assets/audio/cak.b1c5498c44c4452092b1c72aeca6e9e4.wav","assets/assets/audio/dest.939b30105910c642708936b60dfdfcac.wav","assets/assets/audio/hihi.04454016c9c69adcc2dd61b0b653a3b3.wav","assets/assets/audio/hlt.877b95c09d746156fa492fa444243829.wav","assets/assets/audio/jiskra.ff0fe9f2b929eea4846671e24429f330.wav","assets/assets/audio/juuu.a956b96834bafaac2b89de9db6e60245.wav","assets/assets/audio/kvet.e28a0d6e56a31ae46d7b5a81604824fb.wav","assets/assets/audio/music_bells.ad3cbd968cbd36cfdded3c6b866012a0.wav","assets/assets/audio/music_celesta.73734639765b51f96306e4b727111b4b.wav","assets/assets/audio/music_drevo.4f85ef8040db785dc51c4cb5431aeea7.wav","assets/assets/audio/music_harfa.82782892c688b051650e92acb7870530.wav","assets/assets/audio/music_kalimba.e0238eaacbf5fc2ca119921c40eeb326.wav","assets/assets/audio/music_pad.896acb1bde72346d6bbcaf6ddd088a26.wav","assets/assets/audio/music_pluck.6e408e6bd644e31b2a89759ba2551f33.wav","assets/assets/audio/music_skrinka.73dbdb1c860c1981217425f0cf4cddb2.wav","assets/assets/audio/music_ukulele.a72fcd94e3a7afd08cb4e130de37e894.wav","assets/assets/audio/napoveda.1d1731759172f98eb61c2e2cb9c02ee2.wav","assets/assets/audio/objev.2378aaf374fdafdf1ba477d8ea450138.wav","assets/assets/audio/pop.4db6020c909375e9a0d4e23dcfc7ea4e.wav","assets/assets/audio/prazdno.3b65c1d860a1968861a1775c3bf9aba5.wav","assets/assets/audio/slavnost.8b5b4a1989eb669306ad93fcef1a590f.wav","assets/assets/audio/sustnuti.be2a8a1ffc2d82ba2451d2e46e928035.wav","assets/assets/audio/tone_0.ecae0df4a916defe747e9ad49ff69dbd.wav","assets/assets/audio/tone_1.c0b1e7f3b9a2ed1cf2e3d0fa5464dee7.wav","assets/assets/audio/tone_2.e58d84f4883ae9734f643776360103c9.wav","assets/assets/audio/tone_3.7abcc755a9d0572980725d89e0f24704.wav","assets/assets/audio/tone_4.6beef398502980e79e5a0056b3aa5e18.wav","assets/assets/audio/tone_5.5730fa337f7876435668532b18f4d7ab.wav","assets/assets/audio/tone_6.64810a4475e1073a03c96182df9f8973.wav","assets/assets/audio/tone_7.2218c58167b36a3bbaaf48f37dd6fbad.wav","assets/assets/audio/tone_8.c76044650d3cf5420d96694fecf309f1.wav","assets/assets/audio/vitr.c7f890d9284812805c80ddeb2eb1f68c.wav","assets/assets/audio/vzum.2519f4d6f0d8cc319a33e313d3851553.wav","assets/assets/audio/zivani.7be67d39b9d237094e74a0178daf1028.wav","assets/assets/audio/zvire.88c970d4893a6c390d8ecab23821a525.wav","assets/assets/scenes/arktida-2.458b46fda8b77beffd2c0016080be262.jpg","assets/assets/scenes/arktida-3.81fffecf8a12b05fdfa6c5dccc7e9aaf.jpg","assets/assets/scenes/arktida.251175fc2d851ad400473d405d474d1b.jpg","assets/assets/scenes/balkon-2.e2bfa47d21a074f668e1edc6147baa14.jpg","assets/assets/scenes/balkon-3.2c5d8a12a219a64d92e6fd2dbb80c896.jpg","assets/assets/scenes/balkon.84ecbdbfe0d5eb3fd79016d34bce38c6.jpg","assets/assets/scenes/dzungle-2.6a073c826c4954786a48abccfa70d8f5.jpg","assets/assets/scenes/dzungle-3.7d069b5e75ab5834b7d433e5b53312d5.jpg","assets/assets/scenes/dzungle.2cb17a4c7d058266c5ed87d48ea7d804.jpg","assets/assets/scenes/hory-2.8223e2a9f19dec198693ac56af8991b0.jpg","assets/assets/scenes/hory-3.1097726934788891de743d349c065028.jpg","assets/assets/scenes/hory.440e1f6c3529caf930a741b460d3d85e.jpg","assets/assets/scenes/les-2.c4cdbb95c70ea445490c1482f46913f9.jpg","assets/assets/scenes/les-3.764a5271b6b6cf1bc0731c13cf27e5b5.jpg","assets/assets/scenes/les.4d311818090aae3715fcdc983853e2a5.jpg","assets/assets/scenes/louka-2.4df7190ae8a2f181778db0143d94d392.jpg","assets/assets/scenes/louka-3.7d2f8c128b593be42e1a3fa317fdb4fb.jpg","assets/assets/scenes/louka.36bdf0753aa4409f407fbda0ea592527.jpg","assets/assets/scenes/more-2.7f20fc2e1528abfeefe68b4139ae5c1c.jpg","assets/assets/scenes/more-3.d92a2c7c92f1c77433dfac70a81fb822.jpg","assets/assets/scenes/more.a2cf9db14e0cc9b51581be593b255db4.jpg","assets/assets/scenes/noc-2.14609ea534552542a72e0d40499291a1.jpg","assets/assets/scenes/noc-3.b7c62f31ab25ef873a6fa287e6f2e061.jpg","assets/assets/scenes/noc.fe81c81c64477e298d1e7c826fc00304.jpg","assets/assets/scenes/poust-2.62f324e130409fd5be261f9fd31f03ac.jpg","assets/assets/scenes/poust-3.6e7462dab74cc7baa4eca69f3cc5bf99.jpg","assets/assets/scenes/poust.ccd427bf78cc6fab28effc06f6ec0032.jpg","assets/assets/scenes/rybnicek-2.ea37716fe05dee7c1ef5e0793e3becf4.jpg","assets/assets/scenes/rybnicek-3.2afe6715208d7abd878899f90c6c22ea.jpg","assets/assets/scenes/rybnicek.a03cb283d0c56d93ac682186d8116527.jpg","assets/assets/scenes/sad-2.116cc1666c0c06eff41def7c7feaaac1.jpg","assets/assets/scenes/sad-3.160e7522f0e4731238268ec92e0810a2.jpg","assets/assets/scenes/sad.e6276848fe609a1310fcf418faa32c6a.jpg","assets/assets/scenes/zahradka-2.e857b484d608fca9d519174e45ee917e.jpg","assets/assets/scenes/zahradka-3.b7c5ba7483e90e629d059a5b160642e9.jpg","assets/assets/scenes/zahradka.5c0a2b3365ec4815065a534f8863ba1f.jpg","assets/assets/svety/svet_arktida.9417ec45908b155bc57a76f7f5d3371b.png","assets/assets/svety/svet_balkon.b5236df021930d5e2f5f844c969a61ad.png","assets/assets/svety/svet_dzungle.d07642569ea4ef04683d56acbd5c961f.png","assets/assets/svety/svet_hory.5f895893387f13dd74315dc7a92e1f4e.png","assets/assets/svety/svet_les.ec3df27ced3ced57fc6593ce75e2d992.png","assets/assets/svety/svet_louka.47d484c84dc55a81a5f5328f29f48d51.png","assets/assets/svety/svet_morsky-breh.bb835b5b264b67144a80acade061fcde.png","assets/assets/svety/svet_nocni-zahrada.4abd603dfcf1d3ba1bcd0efc8cc3b06d.png","assets/assets/svety/svet_poust.c56ccad3c335ab81cc2c0c15ae7a286a.png","assets/assets/svety/svet_rybnicek.e0a003bd722c4a84bad4fdf8aaf27a4e.png","assets/assets/svety/svet_sad.0361629bd99ed58da8ec374a3d4eaea8.png","assets/assets/svety/svet_zahradka.522d5e159ebc7dcc675a82e8eae0fd45.png","assets/node_modules/@expo-google-fonts/nunito/200ExtraLight/Nunito_200ExtraLight.e3195ab4d111cebd50de96951ef3bbb5.ttf","assets/node_modules/@expo-google-fonts/nunito/200ExtraLight_Italic/Nunito_200ExtraLight_Italic.0f44842abdc321a4e8ef5f2d6eba013d.ttf","assets/node_modules/@expo-google-fonts/nunito/300Light/Nunito_300Light.cc4216a006ff27ad663b12c8d74708ef.ttf","assets/node_modules/@expo-google-fonts/nunito/300Light_Italic/Nunito_300Light_Italic.48b8e1e1d609d04a229cb167ba18ea4d.ttf","assets/node_modules/@expo-google-fonts/nunito/400Regular/Nunito_400Regular.f04f0e9ff969fd52a75deade3a9761cd.ttf","assets/node_modules/@expo-google-fonts/nunito/400Regular_Italic/Nunito_400Regular_Italic.0967d8e924905d0a4a70f38830288891.ttf","assets/node_modules/@expo-google-fonts/nunito/500Medium/Nunito_500Medium.04058d9f3583d30ece037e060c5b9721.ttf","assets/node_modules/@expo-google-fonts/nunito/500Medium_Italic/Nunito_500Medium_Italic.cabcea7d7b9c755ec132e2fe3efe4138.ttf","assets/node_modules/@expo-google-fonts/nunito/600SemiBold/Nunito_600SemiBold.b1364260246b29fd9393a1a071f3af61.ttf","assets/node_modules/@expo-google-fonts/nunito/600SemiBold_Italic/Nunito_600SemiBold_Italic.d3964a4faac6f9f959c6495f7e8bb1cc.ttf","assets/node_modules/@expo-google-fonts/nunito/700Bold/Nunito_700Bold.c133c0b8cd169e7798d0cd239477cf32.ttf","assets/node_modules/@expo-google-fonts/nunito/700Bold_Italic/Nunito_700Bold_Italic.c9d7af177a1a205c866662164104d9f0.ttf","assets/node_modules/@expo-google-fonts/nunito/800ExtraBold/Nunito_800ExtraBold.2b1bb82750274fc2d1043bf3891cb531.ttf","assets/node_modules/@expo-google-fonts/nunito/800ExtraBold_Italic/Nunito_800ExtraBold_Italic.eb8fe8521b6a7c128572d90528b415d6.ttf","assets/node_modules/@expo-google-fonts/nunito/900Black/Nunito_900Black.3ffae19d12dc67269f5cdd8d7a0aaeaf.ttf","assets/node_modules/@expo-google-fonts/nunito/900Black_Italic/Nunito_900Black_Italic.2c030d352cb022edf2f941cadc8367f7.ttf","favicon.ico","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","manifest.webmanifest","soukromi.html"];
const PREFIX = 'mracek-kapka-';
const CACHE = PREFIX + VERSION;
const HASHED = /\/(_expo\/static|assets)\//;

async function fill() {
  const cache = await caches.open(CACHE);
  await Promise.all(
    PRECACHE.map(async (path) => {
      const url = new URL(path, self.registration.scope).href;
      if (HASHED.test(url)) {
        const old = await caches.match(url);
        if (old) return cache.put(url, old);
      }
      const res = await fetch(new Request(url, { cache: 'reload' }));
      if (!res.ok) throw new Error(`${url} ${res.status}`);
      await cache.put(url, res);
    }),
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(fill().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(request, { cache: 'no-cache' });
    if (res.status === 200) await cache.put(request.url.split('#')[0].split('?')[0], res.clone());
    return res;
  } catch (error) {
    const hit = (await cache.match(request, { ignoreSearch: true })) || (request.mode === 'navigate' && (await cache.match(self.registration.scope)));
    if (hit) return hit;
    throw error;
  }
}

async function cacheFirst(request) {
  const hit = await caches.match(request, { ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(request);
  if (res.status === 200 && HASHED.test(request.url)) {
    const cache = await caches.open(CACHE);
    await cache.put(request, res.clone());
  }
  return res;
}

async function ranged(request) {
  const hit = await caches.match(request.url, { ignoreSearch: true });
  if (!hit) return fetch(request);
  const body = await hit.arrayBuffer();
  const size = body.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(request.headers.get('range') || '');
  let start = m && m[1] ? Number(m[1]) : 0;
  let end = m && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
  if (m && !m[1] && m[2]) {
    start = Math.max(0, size - Number(m[2]));
    end = size - 1;
  }
  return new Response(body.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': hit.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  if (request.headers.has('range')) {
    event.respondWith(ranged(request));
    return;
  }
  const html = request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
  event.respondWith(html ? networkFirst(request) : cacheFirst(request));
});
