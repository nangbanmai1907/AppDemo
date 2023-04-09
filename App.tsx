import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import axios from 'axios';
import {VStack, Text, Image, Button, NativeBaseProvider} from 'native-base';
import {ScaledSheet} from 'react-native-size-matters';

function App(): JSX.Element {
  const url = 'https://random-data-api.com/api/users/random_user?size=10';
  const [listUsers, setListUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [screenLoading, setScreenLoading] = useState(true);

  useEffect(() => {
    getUsers();
  }, []);

  // Request API get users
  const getUsers = async () => {
    setIsLoading(true);
    await axios.get(url).then((response: any) => {
      if (screenLoading) {
        setScreenLoading(false);
      }

      if (response?.data) {
        setListUsers(response.data);
        setIsLoading(false);
      }
    });
  };

  const renderItem = useCallback(
    ({item}) => (
      <VStack style={styles.item_content} space={3}>
        <Image
          source={{
            uri: item?.avatar,
          }}
          alt="Alternate Text"
          size="xl"
        />
        <VStack style={styles.view_text}>
          <Text style={styles.title}>{item?.first_name}</Text>
          <Text style={styles.sub_title}>{item?.last_name}</Text>
        </VStack>
      </VStack>
    ),
    [],
  );

  return (
    <NativeBaseProvider>
      <SafeAreaView>
        {screenLoading ? (
          <Text style={styles.title}>Loading...</Text>
        ) : (
          <VStack style={styles.container} space={1}>
            <Button style={styles.button} onPress={() => getUsers()}>
              Fetch Data
            </Button>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              refreshing={isLoading}
              onRefresh={() => getUsers()}
              data={listUsers}
              numColumns={2}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
            {listUsers.length === 0 && (
              <Text style={styles.view_text}>No Data</Text>
            )}
          </VStack>
        )}
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

const styles = ScaledSheet.create({
  container: {
    marginHorizontal: '12@vs',
  },
  item_content: {
    flex: 1,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 8,
    paddingVertical: '10@ms',
    paddingHorizontal: '16@ms',
    backgroundColor: 'white',
    alignItems: 'center',
    margin: '8@vs',
  },
  view_text: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    marginTop: '20@vs',
    marginVertical: '10@vs',
    marginHorizontal: '8@vs',
  },
  title: {
    fontSize: '14@ms',
    fontWeight: '800',
  },
  sub_title: {
    fontSize: '14@ms',
  },
});

export default App;
