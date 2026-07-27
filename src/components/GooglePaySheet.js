import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS } from '../theme';
import { IMAGES } from '../constants/data';
import { PrimaryButton } from './ui';

/**
 * Google Play style purchase sheet.
 * Two states: "add a payment method" when no card is on file, and the
 * confirm-and-pay summary once one exists.
 */
export default function GooglePaySheet({ visible, onClose, onPay, last4, email = 'John_mark@gmail.com' }) {
  const [adding, setAdding] = useState(!last4);
  const hasCard = !!last4;

  const Brand = () => (
    <View style={styles.brandRow}>
      <View style={styles.mcRow}>
        <View style={[styles.mcDot, { backgroundColor: '#EB001B' }]} />
        <View style={[styles.mcDot, { backgroundColor: '#F79E1B', marginLeft: -9 }]} />
      </View>
      <Text style={styles.cardLabel}>Mastercard-{last4 || '2344'}</Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Dismiss" />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.gplay}>Google play</Text>
        </View>

        {!hasCard || adding ? (
          <View style={styles.body}>
            <Text style={styles.title}>Please add a payment method</Text>
            <Text style={styles.email}>{email}</Text>
            <Text style={styles.blurb}>
              Add a payment method to your Google Account to complete your purchase.
              Your payment information is only visible to Google.
            </Text>
            <PrimaryButton
              title="Add credit or debit card"
              onPress={() => setAdding(false)}
              style={{ marginTop: SPACING.xl }}
            />
          </View>
        ) : (
          <View style={styles.body}>
            <View style={styles.lineItem}>
              <Image source={IMAGES.courseEnglish} style={styles.thumb} resizeMode="cover" />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.itemName}>ReadWell Pro</Text>
                <Text style={styles.itemSub}>Readwell - Subscription</Text>
              </View>
              <Text style={styles.itemPrice}>$ 9.99</Text>
            </View>

            <View style={styles.divider} />

            <Pressable style={styles.methodRow} accessibilityRole="button">
              <Brand />
              <Ionicons name="arrow-forward" size={19} color={COLORS.textPrimary} />
            </Pressable>

            <View style={styles.divider} />

            <Text style={styles.terms}>
              Tap "Pay" to complete your purchase. <Text style={styles.more}>More</Text>
            </Text>

            <PrimaryButton title="Pay" onPress={onPay} style={{ marginTop: SPACING.xl }} />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: COLORS.scrim },
  sheet: {
    backgroundColor: '#F8F9FB',
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingBottom: SPACING.xxxl,
    ...SHADOWS.lg,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  gplay: { ...TYPE.h4, color: COLORS.textPrimary, fontWeight: '500', fontSize: 18 },
  body: { padding: SPACING.xl },
  title: { ...TYPE.h3, color: COLORS.textPrimary },
  email: { ...TYPE.body, color: COLORS.textSecondary, marginTop: 2 },
  blurb: { ...TYPE.body, color: COLORS.textSecondary, marginTop: SPACING.lg, lineHeight: 22 },

  lineItem: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 54, height: 54, borderRadius: RADIUS.xs, backgroundColor: COLORS.surfaceSunken },
  itemName: { ...TYPE.h4, color: COLORS.textPrimary, fontSize: 18 },
  itemSub: { ...TYPE.body, color: COLORS.textSecondary },
  itemPrice: { ...TYPE.h4, color: COLORS.textPrimary, fontSize: 17 },

  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: SPACING.lg },

  methodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  mcRow: { flexDirection: 'row', alignItems: 'center', marginRight: SPACING.md },
  mcDot: { width: 26, height: 26, borderRadius: 13 },
  cardLabel: { ...TYPE.h4, color: COLORS.textPrimary, fontWeight: '500', fontSize: 17 },

  terms: { ...TYPE.body, color: COLORS.textSecondary },
  more: { color: COLORS.primary, fontWeight: '600' },
});
