import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface LanguageSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  style?: any;
  onAddLanguage?: () => void; // Callback to add the language
}

// Comprehensive list of world languages
const LANGUAGES = [
  // Major World Languages
  'English', 'Mandarin Chinese', 'Spanish', 'Hindi', 'Arabic', 'Bengali', 'Portuguese', 'Russian', 'Japanese', 'French',
  
  // European Languages
  'German', 'Italian', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech', 'Slovak',
  'Hungarian', 'Romanian', 'Bulgarian', 'Croatian', 'Serbian', 'Slovenian', 'Estonian', 'Latvian', 'Lithuanian',
  'Greek', 'Albanian', 'Macedonian', 'Bosnian', 'Montenegrin', 'Maltese', 'Irish', 'Welsh', 'Scottish Gaelic',
  'Basque', 'Catalan', 'Galician', 'Corsican', 'Sardinian', 'Luxembourgish', 'Frisian', 'Faroese', 'Icelandic',
  
  // Asian Languages
  'Korean', 'Vietnamese', 'Thai', 'Indonesian', 'Malay', 'Tagalog', 'Burmese', 'Khmer', 'Lao', 'Mongolian',
  'Tibetan', 'Nepali', 'Sinhalese', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Punjabi',
  'Urdu', 'Persian', 'Pashto', 'Kurdish', 'Turkish', 'Azerbaijani', 'Kazakh', 'Kyrgyz', 'Uzbek', 'Turkmen',
  'Tajik', 'Armenian', 'Georgian', 'Hebrew', 'Yiddish',
  
  // African Languages
  'Swahili', 'Amharic', 'Yoruba', 'Igbo', 'Hausa', 'Zulu', 'Xhosa', 'Afrikaans', 'Somali', 'Oromo',
  'Tigrinya', 'Shona', 'Ndebele', 'Sesotho', 'Setswana', 'Wolof', 'Fulani', 'Mandinka', 'Bambara', 'Akan',
  'Ewe', 'Fon', 'Lingala', 'Kinyarwanda', 'Kirundi', 'Luganda', 'Kikuyu', 'Luo', 'Maasai',
  
  // Native American Languages
  'Navajo', 'Cherokee', 'Ojibwe', 'Lakota', 'Apache', 'Inuktitut', 'Quechua', 'Guarani', 'Maya', 'Nahuatl',
  
  // Pacific Languages
  'Maori', 'Hawaiian', 'Samoan', 'Tongan', 'Fijian', 'Tahitian', 'Chamorro', 'Palauan', 'Marshallese',
  
  // Constructed Languages
  'Esperanto', 'Klingon', 'Elvish', 'Dothraki',
  
  // Additional Asian Languages
  'Javanese', 'Sundanese', 'Balinese', 'Minangkabau', 'Batak', 'Acehnese', 'Banjar', 'Buginese', 'Makassarese',
  'Cebuano', 'Hiligaynon', 'Waray', 'Bikol', 'Kapampangan', 'Pangasinan', 'Ilocano', 'Tausug', 'Maranao',
  
  // Additional European Languages
  'Occitan', 'Breton', 'Cornish', 'Manx', 'Romansh', 'Ladin', 'Friulian', 'Venetian', 'Neapolitan', 'Sicilian',
  'Piedmontese', 'Lombard', 'Emilian-Romagnol', 'Asturian', 'Aragonese', 'Mirandese', 'Leonese', 'Extremaduran',
  
  // Additional Middle Eastern Languages
  'Aramaic', 'Assyrian', 'Chaldean', 'Syriac', 'Coptic', 'Berber', 'Kabyle', 'Tuareg', 'Sorani Kurdish', 'Kurmanji Kurdish',
  
  // South Asian Languages
  'Assamese', 'Odia', 'Sanskrit', 'Pali', 'Prakrit', 'Sindhi', 'Kashmiri', 'Dogri', 'Konkani', 'Manipuri',
  'Bodo', 'Santali', 'Maithili', 'Bhojpuri', 'Magahi', 'Angika', 'Vajjika', 'Chhattisgarhi', 'Rajasthani', 'Haryanvi',
  
  // Southeast Asian Languages
  'Shan', 'Karen', 'Karenni', 'Mon', 'Rakhine', 'Chin', 'Kachin', 'Wa', 'Hmong', 'Mien', 'Akha', 'Lahu',
  'Lisu', 'Dai', 'Zhuang', 'Bouyei', 'Dong', 'Miao', 'Yao', 'Tujia', 'Uyghur', 'Tibetan', 'Yi', 'Bai',
  
  // Additional African Languages
  'Berber', 'Tuareg', 'Kanuri', 'Teda', 'Zaghawa', 'Fur', 'Masalit', 'Dinka', 'Nuer', 'Shilluk', 'Anuak',
  'Murle', 'Toposa', 'Turkana', 'Pokot', 'Karamojong', 'Acholi', 'Langi', 'Teso', 'Kumam', 'Sebei',
  
  // Sign Languages
  'American Sign Language (ASL)', 'British Sign Language (BSL)', 'French Sign Language (LSF)', 'German Sign Language (DGS)',
  'Japanese Sign Language (JSL)', 'Chinese Sign Language (CSL)', 'International Sign', 'Australian Sign Language (Auslan)',
  'Indian Sign Language (ISL)', 'Russian Sign Language (RSL)',
  
  // Programming Languages (for tech professionals)
  'Python', 'JavaScript', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript',
  'Scala', 'R', 'MATLAB', 'SQL', 'HTML', 'CSS', 'Shell Script', 'Perl', 'Lua', 'Dart', 'Elixir', 'Haskell'
];

const LanguageSearchInput: React.FC<LanguageSearchInputProps> = ({
  value,
  onChangeText,
  label = "Add Language",
  placeholder = "Search...",
  style,
  onAddLanguage,
}) => {
  const [searchText, setSearchText] = useState(value);
  const [filteredLanguages, setFilteredLanguages] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textInputRef = useRef<any>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);

  // Filter languages based on search text
  const filterLanguages = (text: string) => {
    if (!text.trim()) {
      // If no search text, show all languages when focused
      setFilteredLanguages(LANGUAGES);
      console.log(`💡 Showing all ${LANGUAGES.length} languages`);
      return;
    }

    if (text.length < 2) {
      setFilteredLanguages([]);
      return;
    }

    const searchLower = text.toLowerCase().trim();
    const searchWords = searchLower.split(' ').filter(word => word.length > 0);
    
    const filtered = LANGUAGES.filter(language => {
      const languageLower = language.toLowerCase();
      
      // Check if all search words are present in the language
      return searchWords.every(word => languageLower.includes(word));
    }).sort((a, b) => {
      // Prioritize matches that start with the search term
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const firstWord = searchWords[0];
      
      const aStartsWith = aLower.startsWith(firstWord);
      const bStartsWith = bLower.startsWith(firstWord);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // Then prioritize by how early the match appears
      const aIndex = aLower.indexOf(firstWord);
      const bIndex = bLower.indexOf(firstWord);
      
      return aIndex - bIndex;
    }).slice(0, 50); // Limit to 50 results for performance

    setFilteredLanguages(filtered);
    console.log(`🔍 Found ${filtered.length} languages matching "${text}"`);
  };

  // Handle text input change with debouncing
  const handleTextChange = (text: string) => {
    setSearchText(text);
    onChangeText(text);
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // If text is empty and we have the input focused, show all languages
    if (text.length === 0) {
      setFilteredLanguages(LANGUAGES);
      setShowSuggestions(true);
      console.log(`💡 Text cleared, showing all ${LANGUAGES.length} languages`);
      return;
    }
    
    // If text is too short, hide suggestions
    if (text.length < 2) {
      setShowSuggestions(false);
      setFilteredLanguages([]);
      return;
    }
    
    // Debounce search to avoid too many filter calls
    debounceRef.current = setTimeout(() => {
      filterLanguages(text);
    }, 200);
  };

  // Handle language selection
  const handleLanguageSelect = (language: string) => {
    console.log(`🌍 Language selection triggered for: ${language}`);
    isSelectingRef.current = true;
    setSearchText(language);
    onChangeText(language);
    setShowSuggestions(false);
    setFilteredLanguages([]);
    
    // Reset the selection flag after a brief delay
    setTimeout(() => {
      isSelectingRef.current = false;
    }, 100);
    console.log(`✅ Selected language: ${language}`);
  };

  // Handle focus
  const handleFocus = () => {
    // Show all languages when focused
    if (searchText.length >= 2) {
      // If user has typed something, filter normally
      filterLanguages(searchText);
    } else {
      // If no search text, show all available languages
      setFilteredLanguages(LANGUAGES);
      setShowSuggestions(true);
      console.log(`💡 Showing all ${LANGUAGES.length} languages on focus`);
    }
  };

  // Handle blur
  const handleBlur = () => {
    // Don't hide suggestions if we're in the middle of selecting
    if (isSelectingRef.current) {
      return;
    }
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

  // Show suggestions when filtered results are available
  useEffect(() => {
    if (filteredLanguages.length > 0) {
      setShowSuggestions(true);
    }
  }, [filteredLanguages]);

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
            paddingRight: searchText.length > 0 ? 60 : 40,
            marginBottom: 8,
          }
        ]}
        theme={{ roundness: 10 }}
        right={
          <TextInput.Icon 
            icon={() => (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                marginRight: -11
              }}>
                {searchText.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => {
                      console.log('🗑️ Clearing language');
                      setSearchText('');
                      onChangeText('');
                      setShowSuggestions(false);
                      setFilteredLanguages([]);
                      textInputRef.current?.focus();
                    }}
                    style={{ marginRight: 8 }}
                  >
                    <Ionicons name="close-circle" size={20} color="#A1A1AA" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  onPress={onAddLanguage}
                  disabled={!searchText.trim()}
                  style={{ 
                    marginLeft: -10,
                    marginRight: 10,
                    padding: 4,
                    opacity: !searchText.trim() ? 0.5 : 1
                  }}
                >
                  <Ionicons name="add-circle" size={20} color="#6366F1" />
                </TouchableOpacity>
              </View>
            )}
          />
        }
      />
      
      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <View style={styles.suggestionsHeader}>
            <Text style={styles.suggestionsTitle}>
              Languages ({filteredLanguages.length} found)
            </Text>
            <TouchableOpacity 
              onPress={() => {
                console.log('🚫 Manually closing language suggestions');
                setShowSuggestions(false);
                setFilteredLanguages([]);
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
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language, index) => (
                <TouchableOpacity
                  key={`${language}-${index}`}
                  style={styles.suggestionItem}
                  onPress={() => {
                    console.log(`🎯 TouchableOpacity pressed for: ${language}`);
                    handleLanguageSelect(language);
                  }}
                  activeOpacity={0.7}
                  delayPressIn={100}
                  delayPressOut={100}
                >
                  <View style={styles.suggestionContent}>
                    <Text style={styles.languageName} numberOfLines={2}>
                      {language}
                    </Text>
                  </View>
                  <View style={styles.suggestionIcon}>
                    <Ionicons name="language-outline" size={16} color="#6366F1" />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={32} color="#666666" />
                <Text style={styles.emptyText}>
                  No languages found
                </Text>
                <Text style={styles.emptySubtext}>
                  Continue typing to refine search
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
    zIndex: 2500, // Higher than collaboration dropdown (2000) to appear on top
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    height: 43,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 65, // Below the TextInput
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#333333',
    zIndex: 2500,
    elevation: 15,
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
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  suggestionsList: {
    maxHeight: 250,
    minHeight: 100,
    paddingRight: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    backgroundColor: 'transparent',
    minHeight: 40,
  },
  suggestionContent: {
    flex: 1,
    marginRight: 8,
  },
  languageName: {
    color: '#FFFFFF',
    fontSize: 12,
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

export default LanguageSearchInput;