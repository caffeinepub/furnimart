import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Category = {
    #office;
    #home;
  };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    imageId : Storage.ExternalBlob;
    inStock : Bool;
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  let productCatalog = Map.empty<Text, Product>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management Functions
  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    if (productCatalog.containsKey(product.id)) {
      Runtime.trap("Product with this ID already exists");
    };
    productCatalog.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (productCatalog.get(product.id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        productCatalog.add(product.id, product);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    switch (productCatalog.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        productCatalog.remove(productId);
      };
    };
  };

  public query ({ caller }) func listAllProducts() : async [Product] {
    productCatalog.values().toArray();
  };

  public query ({ caller }) func listProductsByCategory(category : Category) : async [Product] {
    productCatalog.values().toArray().filter(
      func(product) { product.category == category }
    );
  };

  public query ({ caller }) func getProduct(productId : Text) : async ?Product {
    productCatalog.get(productId);
  };
};
