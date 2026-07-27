import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../theme';
import { Header, Field, PrimaryButton, Icon3D, Banner } from '../components/ui';
import GooglePaySheet from '../components/GooglePaySheet';
import { useApp } from '../context/AppContext';

const luhn = (num) => {
  const s = num.replace(/\s+/g, '');
  if (!/^\d{12,19}$/.test(s)) return false;
  let sum = 0, alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = parseInt(s[i], 10);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return sum % 10 === 0;
};

const formatCard = (v) =>
  v.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export default function PaymentDetailsScreen({ navigation }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [sheet, setSheet] = useState(false);

  const set = (k, fmt) => (v) => {
    setForm((f) => ({ ...f, [k]: fmt ? fmt(v) : v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
    setDeclined(false);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Enter the name on the card';
    if (!form.number.trim()) e.number = 'Enter your card number';
    else if (!luhn(form.number)) e.number = 'That card number looks invalid';

    if (!form.expiry) e.expiry = 'Required';
    else {
      const [mm, yy] = form.expiry.split('/');
      const m = parseInt(mm, 10), y = parseInt(yy, 10);
      if (!m || m < 1 || m > 12) e.expiry = 'Bad month';
      else if (!yy || yy.length < 2) e.expiry = 'Bad year';
      else {
        const now = new Date();
        const exp = new Date(2000 + y, m);
        if (exp <= now) e.expiry = 'Card expired';
      }
    }

    if (!form.cvv) e.cvv = 'Required';
    else if (!/^\d{3,4}$/.test(form.cvv)) e.cvv = '3–4 digits';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pay = () => {
    if (!validate()) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      // demo decline path: cards ending 0000
      if (form.number.replace(/\s/g, '').endsWith('0000')) {
        setDeclined(true);
        return;
      }
      setSheet(true);
    }, 1200);
  };

  const confirm = () => {
    const last4 = form.number.replace(/\s/g, '').slice(-4);
    const method = { id: `card-${last4}`, brand: 'Mastercard', last4 };
    dispatch({ type: 'ADD_PAYMENT_METHOD', payload: method });
    dispatch({ type: 'SUBSCRIBE', payload: { method } });
    setSheet(false);
    navigation.replace('PaymentSuccess');
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Payment Details" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* order summary */}
          <View style={styles.summary}>
            <View style={styles.summaryTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.planName}>ReadWell Pro</Text>
                <Text style={styles.planSub}>Unlimited Learning</Text>
              </View>
              <View style={styles.planBadge}>
                <Icon3D name="crown" size={26} />
              </View>
            </View>
            <View style={styles.rule} />
            <Text style={styles.dueLabel}>Total Due</Text>
            <View style={styles.dueRow}>
              <Text style={styles.dueAmount}>$9.99</Text>
              <Text style={styles.dueUnit}>/mo</Text>
              <View style={styles.billedPill}>
                <Text style={styles.billedText}>Billed Monthly</Text>
              </View>
            </View>
          </View>

          {declined ? (
            <Banner
              tone="error"
              title="Payment declined"
              message="Your bank turned down this card. Try another card or payment method."
              style={{ marginBottom: SPACING.lg }}
            />
          ) : null}

          <View style={styles.sectionRow}>
            <Ionicons name="card-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Card Information</Text>
          </View>

          <Field
            label="Name on Card"
            value={form.name}
            onChangeText={set('name')}
            placeholder="John Mark"
            icon="person-outline"
            autoCapitalize="words"
            error={errors.name}
          />
          <Field
            label="Card Number"
            value={form.number}
            onChangeText={set('number', formatCard)}
            placeholder="1234 5678 9012 3456"
            icon="card-outline"
            keyboardType="number-pad"
            error={errors.number}
          />

          <View style={styles.row}>
            <Field
              label="Expiry Date"
              value={form.expiry}
              onChangeText={set('expiry', formatExpiry)}
              placeholder="MM/YY"
              icon="calendar-outline"
              keyboardType="number-pad"
              error={errors.expiry}
              style={{ flex: 1 }}
            />
            <View style={{ width: SPACING.md }} />
            <View style={{ flex: 1 }}>
              <View style={styles.cvvHead}>
                <Text style={styles.cvvLabel}>CVV</Text>
                <Text style={styles.cvvHelp}>What is this?</Text>
              </View>
              <Field
                value={form.cvv}
                onChangeText={set('cvv')}
                placeholder="123"
                icon="lock-closed-outline"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                error={errors.cvv}
              />
            </View>
          </View>

          <View style={styles.secureRow}>
            <Ionicons name="shield-checkmark" size={17} color={COLORS.primary} />
            <Text style={styles.secureText}>Payments are secure and encrypted</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            title={processing ? 'Processing…' : 'Pay $9.99'}
            onPress={pay}
            loading={processing}
          />
        </View>
      </KeyboardAvoidingView>

      <GooglePaySheet
        visible={sheet}
        onClose={() => setSheet(false)}
        onPay={confirm}
        last4={form.number.replace(/\s/g, '').slice(-4)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingBottom: 120 },

  summary: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  summaryTop: { flexDirection: 'row', alignItems: 'flex-start' },
  planName: { ...TYPE.h2, color: COLORS.textInverse, fontSize: 23 },
  planSub: { ...TYPE.body, color: 'rgba(255,255,255,0.82)', marginTop: 2 },
  planBadge: {
    width: 46, height: 46, borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center', justifyContent: 'center',
  },
  rule: { height: 1, backgroundColor: 'rgba(255,255,255,0.28)', marginVertical: SPACING.lg },
  dueLabel: { ...TYPE.small, color: 'rgba(255,255,255,0.82)' },
  dueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  dueAmount: { fontSize: 34, fontWeight: '800', color: COLORS.textInverse },
  dueUnit: { ...TYPE.body, color: 'rgba(255,255,255,0.82)', marginLeft: 3 },
  billedPill: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: SPACING.md, paddingVertical: 7,
    borderRadius: RADIUS.xs,
  },
  billedText: { ...TYPE.smallStrong, color: COLORS.textInverse },

  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  sectionTitle: { ...TYPE.h3, color: COLORS.textPrimary, fontSize: 19 },
  row: { flexDirection: 'row' },
  cvvHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  cvvLabel: { ...TYPE.smallStrong, color: COLORS.textPrimary },
  cvvHelp: { ...TYPE.small, color: COLORS.primary },

  secureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, justifyContent: 'center' },
  secureText: { ...TYPE.small, color: COLORS.textSecondary },

  footer: {
    padding: SPACING.xl, paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.background,
    borderTopWidth: 1, borderTopColor: COLORS.divider,
  },
});
