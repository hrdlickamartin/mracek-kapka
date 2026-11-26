import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import type { SaveData, Settings, SleepMinutes } from '../progression/saveData';
import { COLORS, FONTS } from './theme';

const ORDINALS = ['první', 'druhou', 'třetí', 'čtvrtou', 'pátou'];
const COLORS_TASK = ['#ED3E1D', '#F9BA0A', '#BD8EFA', '#3BAEFD', '#EC8FBB'];

function Flower({ color }: { color: string }) {
  return (
    <Svg width={56} height={56} viewBox="-30 -30 60 60">
      <G>
        {[0, 72, 144, 216, 288].map((a) => (
          <Circle key={a} cx={Math.cos((a * Math.PI) / 180) * 12} cy={Math.sin((a * Math.PI) / 180) * 12} r={10} fill={color} />
        ))}
        <Circle r={8} fill="#FBCC03" />
      </G>
    </Svg>
  );
}

export function ParentGate({ onPass, onClose }: { onPass: () => void; onClose: () => void }) {
  const [task] = useState(() => Math.floor(Math.random() * 5));
  const [colors] = useState(() => [...COLORS_TASK].sort(() => Math.random() - 0.5));
  return (
    <View style={styles.overlay}>
      <View style={styles.gate}>
        <Text style={styles.h1}>Pro rodiče</Text>
        <Text style={styles.text}>Ťukněte na {ORDINALS[task]} kytičku zleva.</Text>
        <View style={styles.flowers}>
          {colors.map((c, i) => (
            <Pressable key={c} accessibilityRole="button" accessibilityLabel={`Kytička ${i + 1}`} onPress={() => (i === task ? onPass() : onClose())} style={styles.flowerBtn}>
              <Flower color={c} />
            </Pressable>
          ))}
        </View>
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.secondary}>
          <Text style={styles.secondaryText}>Zpět do hry</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.control}>{children}</View>
    </View>
  );
}

function Steps({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <View style={styles.steps} accessibilityLabel={label}>
      {[0, 1, 2, 3, 4].map((v) => (
        <Pressable key={v} accessibilityRole="button" accessibilityLabel={`${label} ${v}`} onPress={() => onChange(v)} style={[styles.step, { height: 14 + v * 7 }, v <= value && v > 0 && styles.stepOn]} />
      ))}
    </View>
  );
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: value }} accessibilityLabel={label} onPress={() => onChange(!value)} style={[styles.toggle, value && styles.toggleOn]}>
      <View style={[styles.knob, value && styles.knobOn]} />
      <Text style={[styles.toggleText, value && { color: '#FFFFFF' }]}>{value ? 'zap.' : 'vyp.'}</Text>
    </Pressable>
  );
}

function Choice<T extends number>({ options, value, onChange, format }: { options: T[]; value: T; onChange: (v: T) => void; format: (v: T) => string }) {
  return (
    <View style={styles.choices}>
      {options.map((o) => (
        <Pressable key={o} accessibilityRole="button" onPress={() => onChange(o)} style={[styles.choice, o === value && styles.choiceOn]}>
          <Text style={[styles.choiceText, o === value && { color: '#FFFFFF' }]}>{format(o)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function ParentZone({ save, onSettings, onReset, onClose }: { save: SaveData; onSettings: (s: Partial<Settings>) => void; onReset: () => void; onClose: () => void }) {
  const s = save.settings;
  const [confirm, setConfirm] = useState(false);
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.paper }]}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.h1}>Pro rodiče</Text>
        <Text style={styles.h2}>Zvuk</Text>
        <Row label="Hlasitost hudby"><Steps label="Hudba" value={s.music} onChange={(v) => onSettings({ music: v })} /></Row>
        <Row label="Hlasitost hlasu"><Steps label="Hlas" value={s.voice} onChange={(v) => onSettings({ voice: v })} /></Row>
        <Row label="Hlasitost efektů"><Steps label="Efekty" value={s.sfx} onChange={(v) => onSettings({ sfx: v })} /></Row>
        <Row label="Vibrace"><Toggle label="Vibrace" value={s.haptics} onChange={(v) => onSettings({ haptics: v })} /></Row>
        <Text style={styles.h2}>Hraní</Text>
        <Row label="Připomínka spánku">
          <Choice<SleepMinutes> options={[0, 10, 20, 30]} value={s.sleepMinutes} onChange={(v) => onSettings({ sleepMinutes: v })} format={(v) => (v ? `${v} min` : 'vyp.')} />
        </Row>
        <Row label="Méně pohybu"><Toggle label="Méně pohybu" value={s.reducedMotion} onChange={(v) => onSettings({ reducedMotion: v })} /></Row>
        <Row label="Vyšší kontrast"><Toggle label="Vyšší kontrast" value={s.highContrast} onChange={(v) => onSettings({ highContrast: v })} /></Row>
        <Row label="Jazyk hlasu"><Text style={styles.value}>Čeština</Text></Row>
        <Text style={styles.h2}>O hře</Text>
        <Text style={styles.text}>Mráček Kapka je hra pro děti od 3 do 5 let. Nemá reklamy ani nákupy, nesbírá žádná data a funguje bez internetu. Hra se ukládá sama a postup se nikdy neztratí, ani když dítě aplikaci zavře. Nedá se prohrát, nemá skóre ani časové limity.</Text>
        <Text style={styles.text}>Hlas Žabky Žofky používá syntézu řeči zařízení. Pokud zařízení nemá český hlas, hra zůstane plně hratelná díky obrázkovým nápovědám.</Text>
        <Text style={styles.h2}>Začít znovu</Text>
        {!confirm ? (
          <Pressable accessibilityRole="button" onPress={() => setConfirm(true)} style={styles.secondary}>
            <Text style={styles.secondaryText}>Vymazat postup</Text>
          </Pressable>
        ) : (
          <View style={styles.confirm}>
            <Text style={styles.text}>Opravdu smazat celý postup? Album, zahrádka a šatník začnou od začátku.</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable accessibilityRole="button" onPress={() => { onReset(); setConfirm(false); }} style={[styles.secondary, { borderColor: '#B8321D' }]}>
                <Text style={[styles.secondaryText, { color: '#B8321D' }]}>Ano, smazat</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => setConfirm(false)} style={styles.secondary}>
                <Text style={styles.secondaryText}>Ne, nechat</Text>
              </Pressable>
            </View>
          </View>
        )}
        <View style={{ height: 90 }} />
      </ScrollView>
      <Pressable accessibilityRole="button" onPress={onClose} style={styles.back}>
        <Svg width={22} height={22} viewBox="0 0 48 48">
          <Path d="M30 10 L14 24 L30 38" stroke="#FFFFFF" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Text style={styles.backText}>Zpět do hry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(35,57,91,0.55)', alignItems: 'center', justifyContent: 'center' },
  gate: { backgroundColor: COLORS.paper, borderRadius: 24, padding: 24, alignItems: 'center', gap: 12, maxWidth: 560 },
  flowers: { flexDirection: 'row', gap: 10 },
  flowerBtn: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 32, backgroundColor: '#FFFFFF' },
  page: { maxWidth: 640, width: '100%', alignSelf: 'center', padding: 24, gap: 6 },
  h1: { fontFamily: FONTS.extra, fontSize: 20, color: COLORS.ink },
  h2: { fontFamily: FONTS.extra, fontSize: 15, color: COLORS.ink, marginTop: 14 },
  text: { fontFamily: FONTS.regular, fontSize: 12, lineHeight: 18, color: COLORS.ink },
  label: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.ink, flex: 1 },
  value: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.inkSoft },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, minHeight: 52 },
  control: { flexDirection: 'row', alignItems: 'center' },
  steps: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 52, paddingVertical: 8 },
  step: { width: 22, borderRadius: 6, backgroundColor: '#E2EDF5' },
  stepOn: { backgroundColor: COLORS.primary },
  toggle: { width: 76, height: 36, borderRadius: 18, backgroundColor: '#E2EDF5', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 },
  toggleOn: { backgroundColor: COLORS.go, flexDirection: 'row-reverse' },
  knob: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFFFFF' },
  knobOn: {},
  toggleText: { fontFamily: FONTS.bold, fontSize: 12, color: COLORS.inkSoft, flex: 1, textAlign: 'center' },
  choices: { flexDirection: 'row', gap: 6 },
  choice: { minWidth: 52, height: 40, borderRadius: 12, backgroundColor: '#E2EDF5', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  choiceOn: { backgroundColor: COLORS.primary },
  choiceText: { fontFamily: FONTS.bold, fontSize: 13, color: COLORS.ink },
  secondary: { minHeight: 48, paddingHorizontal: 18, borderRadius: 12, borderWidth: 2, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  secondaryText: { fontFamily: FONTS.bold, fontSize: 14, color: '#1C7FCB' },
  confirm: { gap: 10 },
  back: { position: 'absolute', left: 24, bottom: 20, height: 52, paddingHorizontal: 20, borderRadius: 14, backgroundColor: COLORS.go, flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { fontFamily: FONTS.extra, fontSize: 15, color: '#FFFFFF' },
});
