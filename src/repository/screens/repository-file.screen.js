import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Card, Icon } from 'react-native-elements';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { getLanguage } from 'lowlight';
import { github as GithubStyle } from 'react-syntax-highlighter/dist/styles';

import { ViewContainer, LoadingContainer } from '../../components';
import { colors, normalize } from '../../config';
import { getRepositoryFile } from '../repository.action';

const mapStateToProps = state => ({
  fileContent: state.repository.fileContent,
  isPendingFile: state.repository.isPendingFile,
});

const mapDispatchToProps = dispatch => ({
  getRepositoryFileByDispatch: url => dispatch(getRepositoryFile(url)),
});

const styles = StyleSheet.create({
  contentContainer: {
    padding: 0,
    marginTop: 25,
    marginBottom: 25
  },
  dividerStyle: {
    marginBottom: 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: colors.greyVeryLight,
    paddingHorizontal: 10
  },
  branchIcon: {
    marginRight: 5
  },
  headerText: {
    color: colors.primaryDark,
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: normalize(12)
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  contentText: {
    fontFamily: 'Menlo',
    fontSize: normalize(10)
  },
  contentCode: {
    paddingRight: 15,
    paddingBottom: 0
  },
  codeContainer: {
    flex: 1
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 400
  }
});

class RepositoryFile extends Component {
  props: {
    getRepositoryFileByDispatch: Function,
    fileContent: any,
    isPendingFile: boolean,
    navigation: Object,
  };

  constructor() {
    super();

    this.state = {
      imageWidth: null,
      imageHeight: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const content = navigation.state.params.content;
    const fileType = content.name.split('.').pop();

    if (!this.isImage(fileType)) {
      this.props.getRepositoryFileByDispatch(content.download_url);
    } else {
      this.setImageSize(content.download_url);
    }
  }

  setImageSize = uri => {
    Image.getSize(uri, (imageWidth, imageHeight) => {
      if (imageWidth > Dimensions.get('window').width) {
        this.setState({
          imageWidth: Dimensions.get('window').width,
          imageHeight: 400,
        });
      } else {
        this.setState({ imageWidth, imageHeight });
      }
    });
  };

  isImage = fileType => {
    return (
      fileType === 'gif' ||
      fileType === 'png' ||
      fileType === 'jpg' ||
      fileType === 'jpeg' ||
      fileType === 'psd' ||
      fileType === 'svg'
    );
  };

  isKnownType(fileType) {
    return getLanguage(fileType) && !this.isImage(fileType);
  }

  render() {
    const { fileContent, isPendingFile, navigation } = this.props;
    const fileType = navigation.state.params.content.name.split('.').pop();
    const isUnknownType = (!this.isImage(fileType) && !this.isKnownType(fileType));

    return (
      <ViewContainer>
        {isPendingFile && <LoadingContainer animating={isPendingFile} center />}

        {!isPendingFile &&
          <Card
            containerStyle={styles.contentContainer}
            dividerStyle={styles.dividerStyle}
          >
            <ScrollView>
              <View style={styles.header}>
                <Icon
                  containerStyle={styles.branchIcon}
                  name="git-branch"
                  type="octicon"
                  size={22}
                />
                <Text style={styles.headerText}>master</Text>
              </View>

              {isUnknownType &&
                <View style={styles.content}>
                  <ScrollView
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                  >
                    <Text style={styles.contentText}>
                      {fileContent}
                    </Text>
                  </ScrollView>
                </View>
              }

              {this.isKnownType(fileType) &&
                <View style={styles.codeContainer}>
                  <SyntaxHighlighter
                    language={fileType}
                    CodeTag={Text}
                    codeTagProps={{style: styles.contentCode}}
                    style={GithubStyle}
                    fontFamily={styles.contentText.fontFamily}
                    fontSize={styles.contentText.fontSize}>{fileContent}</SyntaxHighlighter>
                </View>
              }

              {this.isImage(fileType) &&
                <View style={styles.imageContainer}>
                  <Image
                    style={{
                      width: this.state.imageWidth,
                      height: this.state.imageHeight,
                    }}
                    source={{
                      uri: navigation.state.params.content.download_url,
                    }}
                  />
                </View>}
            </ScrollView>
          </Card>}
      </ViewContainer>
    );
  }
}

export const RepositoryFileScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryFile);
