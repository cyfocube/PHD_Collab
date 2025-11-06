import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface FieldCategory {
  id: number;
  category: string;
  fields: string[];
}

interface FlatField {
  field: string;
  category: string;
}

interface FieldSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  style?: any;
}

const FieldSearchInput: React.FC<FieldSearchInputProps> = ({
  value,
  onChangeText,
  label = "Field",
  placeholder = "Search",
  style,
}) => {
  const [searchText, setSearchText] = useState(value);
  const [fieldCategories, setFieldCategories] = useState<FieldCategory[]>([]);
  const [flatFields, setFlatFields] = useState<FlatField[]>([]);
  const [filteredFields, setFilteredFields] = useState<FlatField[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const textInputRef = useRef<any>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);

  // Load academic fields data from GitHub
  const loadFields = async () => {
    if (isDataLoaded) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/cyfocube/PHD_Collab/main/database/Fields/academic_fields.json',
        {
          headers: {
            'Cache-Control': 'no-cache',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: FieldCategory[] = await response.json();
      console.log(`📚 Loaded ${data.length} field categories from database`);
      
      // Flatten the categories into individual fields
      const flattenedFields: FlatField[] = [];
      data.forEach(category => {
        category.fields.forEach(field => {
          flattenedFields.push({
            field: field,
            category: category.category
          });
        });
      });
      
      console.log(`🔄 Flattened into ${flattenedFields.length} individual fields`);
      setFieldCategories(data);
      setFlatFields(flattenedFields);
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error loading academic fields:', error);
      Alert.alert(
        'Database Error',
        'Failed to load academic fields database. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter fields based on search text
  const filterFields = (text: string) => {
    if (!text.trim() || text.length < 2) {
      setFilteredFields([]);
      return;
    }

    const searchLower = text.toLowerCase().trim();
    const searchWords = searchLower.split(' ').filter(word => word.length > 0);
    
    // Use a Map to efficiently remove duplicates while filtering
    const uniqueFields = new Map<string, FlatField>();
    
    flatFields.forEach(fieldObj => {
      const fieldLower = fieldObj.field.toLowerCase();
      const categoryLower = fieldObj.category.toLowerCase();
      const combinedText = `${fieldLower} ${categoryLower}`;
      
      // Check if all search words are present in field name or category
      const matches = searchWords.every(word => 
        fieldLower.includes(word) || categoryLower.includes(word) || combinedText.includes(word)
      );
      
      if (matches) {
        // Use field name as unique key to prevent duplicates
        const uniqueKey = fieldLower;
        
        // Only add if not already present (keeps first occurrence)
        if (!uniqueFields.has(uniqueKey)) {
          uniqueFields.set(uniqueKey, fieldObj);
        }
      }
    });
    
    const filtered = Array.from(uniqueFields.values())
      .sort((a, b) => {
        // Prioritize matches that start with the search term
        const aFieldLower = a.field.toLowerCase();
        const bFieldLower = b.field.toLowerCase();
        const firstWord = searchWords[0];
        
        const aStartsWith = aFieldLower.startsWith(firstWord);
        const bStartsWith = bFieldLower.startsWith(firstWord);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Then prioritize by how early the match appears
        const aIndex = aFieldLower.indexOf(firstWord);
        const bIndex = bFieldLower.indexOf(firstWord);
        
        return aIndex - bIndex;
      })
      .slice(0, 100);

    setFilteredFields(filtered);
    console.log(`🔍 Found ${filtered.length} unique fields matching "${text}" (${flatFields.length} total in pool)`);
  };

  // Handle text input change with debouncing
  const handleTextChange = (text: string) => {
    setSearchText(text);
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // If text is too short, hide suggestions immediately
    if (text.length < 2) {
      setShowSuggestions(false);
      setFilteredFields([]);
      return;
    }
    
    // Debounce search to avoid too many filter calls
    debounceRef.current = setTimeout(() => {
      filterFields(text);
    }, 200); // Reduced debounce time for more responsive search
  };

  // Handle field selection
  const handleFieldSelect = (fieldObj: FlatField) => {
    console.log(`🔥 Field selection triggered for: ${fieldObj.field}`);
    isSelectingRef.current = true;
    const fieldName = fieldObj.field;
    setSearchText(fieldName);
    onChangeText(fieldName);
    setShowSuggestions(false);
    setFilteredFields([]);
    // Reset the selection flag after a brief delay
    setTimeout(() => {
      isSelectingRef.current = false;
    }, 100);
    console.log(`✅ Selected field: ${fieldName}`);
  };

  // Handle focus
  const handleFocus = async () => {
    await loadFields();
    if (searchText.length >= 2) {
      filterFields(searchText);
    }
  };

  // Handle blur
  const handleBlur = () => {
    // Don't hide suggestions if we're in the middle of selecting or scrolling
    if (isSelectingRef.current) {
      return;
    }
    // Longer delay to allow for scrolling and selection
    setTimeout(() => {
      if (!isSelectingRef.current) {
        setShowSuggestions(false);
      }
    }, 500);
  };

  // Effect to sync external value changes
  useEffect(() => {
    if (value !== searchText) {
      setSearchText(value);
    }
  }, [value]);

  // Show suggestions when filtered results are available and text input is focused
  useEffect(() => {
    // Only show suggestions if we have results and text is long enough
    if (filteredFields.length > 0 && searchText.length >= 2) {
      setShowSuggestions(true);
    } else if (searchText.length < 2) {
      setShowSuggestions(false);
    }
  }, [filteredFields, searchText]);

  return (
    <View style={[styles.container, style]}>
      <TextInput
          ref={textInputRef}
          label={label}
          value={searchText}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          mode="outlined"
          placeholder={placeholder}
          style={[
            styles.textInput,
            { 
              paddingRight: searchText.length > 0 ? 60 : 40,  // Less padding, icons moved left
              paddingLeft: 0,  // Add left padding so cursor doesn't touch the border
              marginBottom: 16,  // Add margin below the field
              marginTop: 0,      // Add margin above the field
              marginLeft: 0,     // Add margin to the left
              marginRight: 0     // Add margin to the right
            }
          ]}
          theme={{ roundness: 10 }}
          right={
            loading ? (
              <TextInput.Icon icon={() => <ActivityIndicator size={20} color="#6366F1" />} />
            ) : (
              <TextInput.Icon 
                icon={() => (
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    marginRight: - 11 // Shift icons to the left
                  }}>
                    {searchText.length > 0 && (
                      <TouchableOpacity 
                        onPress={() => {
                          console.log('🗑️ Clearing field');
                          setSearchText('');
                          onChangeText('');
                          setShowSuggestions(false);
                          setFilteredFields([]);
                          textInputRef.current?.focus();
                        }}
                        style={{ marginRight: 8 }}  // Reduced spacing between icons
                      >
                        <Ionicons name="close-circle" size={20} color="#A1A1AA" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                      onPress={() => {
                        if (searchText.length >= 2) {
                          filterFields(searchText);
                          setShowSuggestions(true);
                        }
                      }}
                      style={{ 
                        marginLeft: -10,     // Move search icon left/right
                        marginRight: 10,    // Move search icon right/left  
                        marginTop: 0,      // Move search icon up/down
                        marginBottom: 0,   // Move search icon down/up
                        padding: 4         // Add padding around the touch area
                      }}
                    >
                      <Ionicons name="search" size={20} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )
          }
        />
      
      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <View style={styles.suggestionsHeader}>
            <Text style={styles.suggestionsTitle}>
              Academic Fields ({filteredFields.length} found)
            </Text>
            <TouchableOpacity 
              onPress={() => {
                console.log('🚫 Manually closing field suggestions');
                setShowSuggestions(false);
                setFilteredFields([]);
              }}
              style={{ padding: 4, alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="close" size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
          
          <ScrollView
            style={styles.suggestionsList}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={false}
            bounces={true}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingRight: 20 }}
            indicatorStyle="white"
            scrollIndicatorInsets={{ right: 1 }}
          >
            {filteredFields.length > 0 ? (
              filteredFields.map((item, index) => (
                <TouchableOpacity
                  key={`${item.field}-${index}`}
                  style={styles.suggestionItem}
                  onPress={() => {
                    console.log(`🎯 TouchableOpacity pressed for: ${item.field}`);
                    handleFieldSelect(item);
                  }}
                  activeOpacity={0.7}
                  delayPressIn={100}
                  delayPressOut={100}
                >
                  <View style={styles.suggestionContent}>
                    <Text style={styles.fieldName} numberOfLines={1}>
                      {item.field}
                    </Text>
                  </View>
                  <View style={styles.suggestionIcon}>
                    <Ionicons name="library-outline" size={16} color="#6366F1" />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={32} color="#666666" />
                <Text style={styles.emptyText}>
                  {loading ? 'Loading academic fields...' : 'No fields found'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {loading ? 'Please wait...' : 'Continue typing to refine search'}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 2000,
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    height: 43,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 45, // Just below the TextInput
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: '#333333',
    zIndex: 2000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    backgroundColor: '#222222',
  },
  suggestionsTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  suggestionsList: {
    maxHeight: 250,
    minHeight: 100,
    paddingRight: 8, // Make room for scroll indicator
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    backgroundColor: 'transparent',
    minHeight: 36,
  },
  suggestionContent: {
    flex: 1,
    marginRight: 8,
  },
  fieldName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
  },
  suggestionIcon: {
    padding: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#A1A1AA',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default FieldSearchInput;