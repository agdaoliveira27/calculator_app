import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function App() {
  const [expression, setExpression] = useState('0');
  const [result, setResult] = useState('0');

  const handleButtonPress = (value: string) => {
    console.log(`button pressed :${value}`);

    switch (value) {
      case 'AC':
        setExpression('0');
        setResult('0');
        break;

      case 'C':
        if (expression.length > 1) {
          setExpression(expression.slice(0, -1));
        } else {
          setExpression('0');
        }
        break;

      case '=':
        try {
          // Handle negative numbers and multiple operations
          const sanitizedExpression = expression.replace(/--/g, '+');
          const calculatedResult = eval(sanitizedExpression);
          
          if (!isFinite(calculatedResult)) {
            setResult('Error');
          } else {
            // Format the result to handle decimal places
            const formattedResult = Number.isInteger(calculatedResult)
              ? calculatedResult.toString()
              : calculatedResult.toFixed(12).replace(/\.?0+$/, '');
            setResult(formattedResult);
          }
        } catch (error) {
          setResult('Error');
        }
        break;

      default:
        // Handle initial zero and operators
        if (expression === '0') {
          if (value === '00' || ['+', '*', '/', '.'].includes(value)) {
            setExpression('0' + value);
          } else {
            setExpression(value);
          }
        } else {
          // Prevent multiple decimal points in a number
          const lastNumber = expression.split(/[-+*/]/).pop() || '';
          if (value === '.' && lastNumber.includes('.')) {
            return;
          }

          // Prevent multiple operators in sequence (except for negative numbers)
          const lastChar = expression.slice(-1);
          if (['+', '*', '/'].includes(value) && ['+', '*', '/', '-'].includes(lastChar)) {
            if (lastChar === '-') {
              setExpression(expression.slice(0, -2) + value);
            } else {
              setExpression(expression.slice(0, -1) + value);
            }
          } else {
            setExpression(expression + value);
          }
        }
    }
  };

  const buttonRows = [
    ['7', '8', '9', 'C', 'AC'],
    ['4', '5', '6', '+', '-'],
    ['1', '2', '3', '*', '/'],
    ['0', '.', '00', '=', ''],
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Calculator</Text>
      </View>

      {/* Display */}
      <View style={styles.display}>
        <Text style={styles.expression}>{expression}</Text>
        <Text style={styles.result}>{result}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        {buttonRows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((button, buttonIndex) => {
              if (!button) return <View key={`empty-${buttonIndex}`} style={styles.button} />;

              const isOperator = ['+', '-', '*', '/'].includes(button);
              const isClear = ['C', 'AC'].includes(button);
              const isEqual = button === '=';

              return (
                <TouchableOpacity
                  key={`button-${button}-${buttonIndex}`}
                  style={[
                    styles.button,
                    styles.buttonBackground,
                  ]}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.buttonText,
                    isClear && styles.clearButtonText
                  ]}>
                    {button}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appBar: {
    height: 60,
    backgroundColor: '#607D8B',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  appBarTitle: {
    color: '#ECEFF1',
    fontSize: 20,
    fontWeight: '500',
  },
  display: {
    backgroundColor: '#455A64',
    padding: 16,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    minHeight: 150,
  },
  expression: {
    fontSize: 32,
    color: '#ECEFF1',
    marginBottom: 8,
  },
  result: {
    fontSize: 48,
    color: '#ECEFF1',
  },
  buttonsContainer: {
    flex: 1,
    backgroundColor: '#78909C',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  button: {
    flex: 1,
    margin: 2,
  },
  buttonBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#78909C',
    margin: 2,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 24,
    color: '#263238',
  },
  clearButtonText: {
    color: '#EF5350',
  },
});