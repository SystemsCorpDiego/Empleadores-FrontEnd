import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { backgroundColor: '#1A76D2' },
  section: { color: 'white', textAlign: 'center', margin: 30 },
});

// Create Document Component
export const MyDocument = ({ rows_mis_ddjj }) => (
  <Document>
    {rows_mis_ddjj.map((row) => (
      <Page key={row.id} size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Periodo: {row.periodo}</Text>
          <Text>
            Número:{' '}
            {row.secuencia === 0
              ? 'Original'
              : `Rectificativa ${row.secuencia}`}
          </Text>
          <Text>Total UOMA CS: {row.totalUomaCS}</Text>
          <Text>Total UOMA AS: {row.totalUomaAS}</Text>
          <Text>Total Cuota Usufructo: {row.totalCuotaUsu}</Text>
          <Text>Total Art. 46: {row.totalART46}</Text>
          <Text>Total AMTIMA: {row.totalAmtimaCS}</Text>
        </View>
      </Page>
    ))}
  </Document>
);
