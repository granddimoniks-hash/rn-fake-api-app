import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createTag, deleteTag, getTags, type Tag } from "@/api/tags";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function TagsScreen() {
  const theme = useTheme();
  const [tags, setTags] = useState<Array<Tag>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const loadTags = () => {
    setLoading(true);
    setError(null);
    getTags()
      .then((response) => {
        if (response.data) {
          setTags(response.data);
        }
      })
      .catch(() => setError("Не удалось загрузить теги"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleAdd = () => {
    const title = newTitle.trim();
    if (!title) return;
    createTag(title)
      .then((response) => {
        setTags((prev) => [...prev, response.data]);
        setNewTitle("");
      })
      .catch(() => setError("Не удалось добавить тег"));
  };

  const handleDelete = (id: number) => {
    deleteTag(id)
      .then(() => setTags((prev) => prev.filter((tag) => tag.id !== id)))
      .catch(() => setError("Не удалось удалить тег"));
  };

  const renderTag = (tag: Tag) => {
    return (
      <ThemedView key={tag.id} style={styles.tagRow} type="backgroundElement">
        <ThemedText type="code" themeColor="textSecondary">
          #{tag.id}
        </ThemedText>
        <ThemedText type="small" style={styles.tagTitle}>
          {tag.title}
        </ThemedText>
        <Pressable
          onPress={() => handleDelete(tag.id)}
          style={({ pressed }) => pressed && styles.pressed}>
          <ThemedView type="backgroundSelected" style={styles.deleteButton}>
            <ThemedText type="smallBold">✕</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle" style={styles.title}>
          Теги
        </ThemedText>

        <ThemedView style={styles.addRow}>
          <TextInput
            value={newTitle}
            onChangeText={setNewTitle}
            onSubmitEditing={handleAdd}
            placeholder="Название нового тега"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.backgroundElement },
            ]}
          />
          <Pressable onPress={handleAdd} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedView type="backgroundSelected" style={styles.addButton}>
              <ThemedText type="smallBold">Добавить</ThemedText>
            </ThemedView>
          </Pressable>
        </ThemedView>

        {error && (
          <Pressable onPress={loadTags}>
            <ThemedText type="small" style={styles.error}>
              {error}. Нажмите, чтобы повторить.
            </ThemedText>
          </Pressable>
        )}

        {loading ? (
          <ActivityIndicator color={theme.text} />
        ) : (
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {tags.map((tag) => renderTag(tag))}
          </ScrollView>
        )}

        {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    paddingTop: Platform.select({ web: Spacing.six + Spacing.four }),
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  title: {
    textAlign: "center",
  },
  addRow: {
    flexDirection: "row",
    gap: Spacing.two,
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  error: {
    color: "#e5484d",
    textAlign: "center",
  },
  list: {
    alignSelf: "stretch",
  },
  listContent: {
    gap: Spacing.two,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  tagTitle: {
    flex: 1,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
