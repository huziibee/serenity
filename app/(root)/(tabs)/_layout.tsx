import { Drawer } from "expo-router/drawer";
import {
  Image,
  ImageSourcePropType,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo/vector-icons
import { icons } from "@/constants";

// Drawer Item Component
const DrawerItem = ({
  source,
  focused,
  onPress,
  title,
}: {
  source: ImageSourcePropType;
  focused: boolean;
  onPress: () => void;
  title: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: focused ? "rgba(147, 51, 234, 0.1)" : "transparent",
      marginHorizontal: 12,
      borderRadius: 12,
      marginVertical: 4,
    }}
  >
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: focused ? "#9333EA" : "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={source}
        tintColor={focused ? "white" : "#9333EA"}
        resizeMode="contain"
        style={{ width: 24, height: 24 }}
      />
    </View>
    <Text
      style={{
        marginLeft: 12,
        fontSize: 16,
        fontWeight: focused ? "600" : "400",
        color: focused ? "#9333EA" : "#666666",
      }}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

// Custom Header Component
const CustomHeader = ({ navigation }: any) => (
  <View
    style={{
      height: 90,
      paddingTop: 26,
      backgroundColor: "#9333EA",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    }}
  >
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <Ionicons name="menu" size={28} color="white" />
    </TouchableOpacity>
    <Text
      style={{
        marginLeft: 16,
        color: "white",
        fontSize: 18,
        fontWeight: "600",
      }}
    >
      Serenity AI
    </Text>
  </View>
);

// Custom Drawer Content
function CustomDrawerContent(props: any) {
  const { state, navigation } = props;

  return (
    <DrawerContentScrollView
      {...props}
      style={{
        backgroundColor: "white",
      }}
    >
      {/* App Logo/Header */}
      <View
        style={{
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Image
          source={icons.logo}
          style={{ width: 120, height: 40 }}
          resizeMode="contain"
        />

        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            color: "#666666",
          }}
        >
          Serenity AI
        </Text>
      </View>

      {/* Navigation Items */}
      {state.routes.map((route: any, index: number) => (
        <DrawerItem
          key={route.key}
          source={
            route.name === "home"
              ? icons.home
              : route.name === "journal"
                ? icons.list
                : route.name === "chat"
                  ? icons.chat
                  : icons.profile
          }
          focused={state.index === index}
          onPress={() => navigation.navigate(route.name)}
          title={route.name.charAt(0).toUpperCase() + route.name.slice(1)}
        />
      ))}
    </DrawerContentScrollView>
  );
}

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        header: (props) => <CustomHeader {...props} />,
        drawerStyle: {
          backgroundColor: "white",
          width: 280,
        },
        drawerType: "front",
        swipeEnabled: true,
        swipeEdgeWidth: 100,
        drawerStatusBarAnimation: "slide",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: "home",
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="chat"
        options={{
          title: "Chat",
          drawerLabel: "Chat",
        }}
      />
      <Drawer.Screen
        name="journal"
        options={{
          title: "journal",
          drawerLabel: "Journal",
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "Profile",
          drawerLabel: "Profile",
        }}
      />
    </Drawer>
  );
}
