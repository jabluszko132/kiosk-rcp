import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import { colors } from '../constants/Colors.ts';

export default function StyledBtn(props) {
        const bgColor = props.isSecondary ? colors.secondary : colors.primary;
        const styles = StyleSheet.create({
            container: {
                justifyContent: 'center',
                alignItems: 'center',
            },
            btn: {
                backgroundColor: bgColor,
                color: "#fff",
                padding: "10",
                height: "100",
                width: "200",
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 30,
                fontWeight: 'bold',
            }
        });

        return (
                <TouchableHighlight onPress={props.onPress} style={styles.container}>
                    <Text style={styles.btn}>
                        {props.title}
                    </Text>
                </TouchableHighlight>
            );
    }
