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
                padding: "20",
                height: "200",
                width: "400",
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 60,
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
