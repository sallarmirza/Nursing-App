// app/(tabs)/notes
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { StatusBadge } from "../../components/common/StatusBadge";

interface PatientNote {
  id: string;
  name: string;
  status: string;
  tone: "success" | "danger" | "warning";
}

const NOTES_LIST: PatientNote[] = [
  {
    id: "1",
    name: "Mr. Ahmed Ali Khan",
    status: "Vitals Updated",
    tone: "success",
  },
  {
    id: "2",
    name: "Mrs. Fatima Sana",
    status: "Pending Medication",
    tone: "warning",
  },
  {
    id: "3",
    name: "Mrs. Nida Farooq",
    status: "Vitals Overdue",
    tone: "danger",
  },
  {
    id: "4",
    name: "Mr. Altaf Ahmed",
    status: "Medication Overdue",
    tone: "danger",
  },
  { id: "5", name: "Mr. Daniyal Ali", status: "IV Bag Low", tone: "warning" },
];

export default function NursingNotesScreen() {
  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={["top", "left", "right"]}
    >
      <ScreenHeader
        title="Nursing Notes"
        rightElement={<PersonAvatar size={36} />}
      />

      <ScrollView
        contentContainerClassName="p-5 gap-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <Text className="-mt-2 text-[13px] text-gray-500">
          Morning Shift, July 15, 2026
        </Text>

        <View className="rounded-2xl bg-white px-4 py-2">
          {NOTES_LIST.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center justify-between py-3.5 ${
                index < NOTES_LIST.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }`}
              onPress={() =>
                router.push({
                  pathname: "/notes/sbar",
                  params: { patientId: item.id, name: item.name },
                })
              }
            >
              <View className="flex-row items-center gap-3">
                <PersonAvatar size={28} />
                <Text className="text-sm font-semibold text-gray-900">
                  {item.name}
                </Text>
              </View>
              <StatusBadge label={item.status} tone={item.tone} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity className="self-end py-1">
          <Text className="text-[13px] font-semibold text-gray-800">
            See all
          </Text>
        </TouchableOpacity>

        <PrimaryButton
          label="Notes History"
          onPress={() => router.push("/notes/history")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}